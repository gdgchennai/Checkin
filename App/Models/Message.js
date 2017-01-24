import { Firebase } from "../Lib";

let storageRef = Firebase.storage().ref('images');
import RNFetchBlob from 'react-native-fetch-blob'

const polyfill = RNFetchBlob.polyfill

window.XMLHttpRequest = polyfill.XMLHttpRequest
window.Blob = polyfill.Blob

function lisentToMessages(options) {
  Firebase.database().ref().child('messages').on('child_added', function(snapshot){
    var message = snapshot.val();
    message.id = snapshot.key;
    Firebase.database().ref().child('users/' + message.sender_id).once('value').then(function(snapshot){
      var user = snapshot.val();
      message.sender = user;
      options.onNewMessage({ message: message });
    });
  });
}

function stopLisentingToMessages() {
  Firebase.database().ref().child('messages').off('child_added');
}

function sendMessage(options) {
  var message_data = options.data;  
  var file = options.file;
  if (file) {
    Blob.build(RNFetchBlob.wrap(file.path), { type : 'image/jpeg' })
        .then((blob) => { 
                          var file_name =   String(new Date().getTime()) + message_data.sender_id;
                          storageRef.child(file_name).put(blob, { contentType : 'image/png' }).then(function(snapshot) {
                            var url = snapshot.downloadURL;
                            message_data.image_url = url;
                            Firebase.database().ref().child('messages').push(message_data).then(function(data){
                              options.onSuccess();  
                            });
                        }) 
        })
        .then((snapshot) => { /* there we go ! */ })
  } else {
    Firebase.database().ref().child('messages').push(message_data).then(function(data){
      options.onSuccess();  
    }); 
  }
}

export {
  lisentToMessages,
  stopLisentingToMessages,
  sendMessage,
};
