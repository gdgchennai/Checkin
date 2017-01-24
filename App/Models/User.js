import { NativeModules, Alert } from 'react-native';
import { Firebase } from "../Lib";
import moment from 'moment';

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  GraphRequest,
  LoginManager,
  GraphRequestManager,
} = FBSDK;

function isUserSignedIn(options) {
  Firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      options.onSuccess({user: user, authenticated: true});
    } else {
      options.onSuccess({authenticated: false});
    }
  });
}

function loginUser(user) {
   Firebase.database().ref('/users/' + user.uid ).once('value').then(function(snapshot) {
    if (snapshot.val()!= null) {
      var user_profile = snapshot.val().profile;
      user_profile.id = user.uid;
      setCurrentUser(user_profile);
    } else {
        Actions.ProfileCompletion({user_id: user.uid});
      }
  });
  return true;
}

function signUpWithEmail(options) {
  Firebase
    .auth()
    .createUserWithEmailAndPassword(options.data.email, options.data.password)
    .then(function(user) {
      var user_data = {
        email: user.email,
        name: options.data.name
      };
      Firebase.database().ref('users/' + user.uid).set(user_data).then(function(snap){
          options.onSuccess({user: user});
      });
    }.bind(this),
      function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        options.onError({message: errorMessage})
    }.bind(this));
}

function signInWithEmail(options) {
  Firebase.auth()
    .signInWithEmailAndPassword(options.data.email, options.data.password)
    .then(function() {
      var user = Firebase.auth().currentUser;
      options.onSuccess({user: user});
    }.bind(this),
      function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        options.onError({message: errorMessage})
      });
}

function logoutUser(options) {
  Firebase.auth().signOut().then(function() {
    // Sign-out successful.
    options.onSuccess({
      loggedOut: true
    })
  }, function(error) {
    // An error happened.
  });
}

function sendPasswordResetEmail(options) {
  Firebase.auth().sendPasswordResetEmail(options.email).then(function(){
    options.onSuccess(true);
  })
}

function isCheckedIn(options) {
  var date_key = getTodaysKey();

  isUserSignedIn({
    onSuccess: function(data) {
      if (data.authenticated) {
        var user_key = data.user.uid;
        Firebase.database().ref('checkins/' + date_key + "/" + user_key).once('value').then(function(snap){
          if (snap != null) {
            options.onSuccess({user_id: user_key, checkedIn: snap.val()});
          } else {
            options.onSuccess({user_id: user_key, checkedIn: false});
          }
        });
      } else {
        options.onSuccess({checkedIn: false});
      }
    }
  })
}

function checkIn(options) {
  var date_key = getTodaysKey();
  isUserSignedIn({
    onSuccess: function(data) {
      if (data.authenticated) {
        var checkin_info = {};
        checkin_info[data.user.uid] = true;
        Firebase.database().ref('checkins/' + date_key).update(checkin_info).then(function(){
          options.onSuccess({checkedIn: true});
        });
      }
    }
  })
}

function getCheckIns(options) {
  var date_key = getTodaysKey();
  Firebase.database().ref('checkins/' + date_key).on('child_added', function(snap){
    var user_key = snap.key;
    Firebase.database().ref('users/' + user_key).once('value').then(function(snapshot){
      var user = snapshot.val();
      user.id = snapshot.key;
      options.onSuccess({ user: user });
    });
  });
}

function getTodaysKey() {
  var date_key = moment().format('MM-D-YY');
  return date_key;
}

function facebookLogin(options) {
  if(options) {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
        function(result) {
          if (result.isCancelled) {
            Toast.showShortBottom("Login cancelled");
          } else {
            AccessToken.getCurrentAccessToken().then(function(data) {
              var accessToken = Firebase.auth.FacebookAuthProvider.credential(data.accessToken);
              getFacebookUserInfo({
                data: {
                  accessToken: data.accessToken,
                },
                onSuccess: function(data) {
                  var user = data.user;
                  handleFirebaseLogin(accessToken, user, options);
                }
              })
              
            }.bind(this));
          }
        }.bind(this),
      );
  }
}

function getFacebookUserInfo(options) {
  let req = new GraphRequest('/me', {
      httpMethod: 'GET',
      version: 'v2.5',
      parameters: {
          'fields': {
              'string' : 'email,name'
          }
      }
  }, (err, res) => {
      options.onSuccess({user: res});
  });
  new GraphRequestManager().addRequest(req).start();

}

function handleFirebaseLogin(accessToken, user, options) {
  Firebase.auth()
      .signInWithCredential(accessToken)
      .catch(function(error) {
        options.onError();
      })
      .then(function(data) {
        var user_data = {
          name: user.name,
          email: user.email || "",
        };
        Firebase.database().ref('users/' + data.uid).set(user_data).then(function(snap){
            options.onSuccess({user: user});
        });        
      });
}

export {
  isUserSignedIn,
  loginUser,
  logoutUser,
  facebookLogin,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordResetEmail,
  checkIn,
  isCheckedIn,
  getCheckIns,
};