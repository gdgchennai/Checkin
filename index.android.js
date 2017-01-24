/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  ActivityIndicator,
  Navigator,
  StyleSheet,
} from 'react-native';

import Home from './App/Components/Home';
import Login from './App/Components/Login';
import SignUp from './App/Components/SignUp';
import Messenger from './App/Components/Messenger';
import { User } from './App/Models';
import {Scene, Router} from 'react-native-router-flux';
import FCM from 'react-native-fcm';

export default class CheckIn extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      authenticated: false,
      loading: true,
    };
  }

  componentWillMount() {
    User.isUserSignedIn({
      onSuccess: function(data) {
        this.setState({
          loading: false,
          authenticated: data.authenticated
        })
      }.bind(this)
    })
  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
        console.log(token)
        // store fcm token in your server
    });
    this.notificationListener = FCM.on('notification', (notif) => {
        // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        }
        if(notif.opened_from_tray){
          //app is open/resumed because user clicked banner
        }
    });
    this.refreshTokenListener = FCM.on('refreshToken', (token) => {
        console.log(token)
        // fcm token may not be available on first load, catch it here
    });
    FCM.subscribeToTopic('messages');
  }

  render() {
    var component;
    if (this.state.loading) {
      return (
          <ActivityIndicator
            animating={this.state.loading}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        );
    } 

    else {
      return (
        <Router>
          <Scene key="root">
            <Scene key="Home" component={Home} initial={this.state.authenticated} title="Home" hideNavBar={true}/>
            <Scene key="Login" component={Login} initial={!this.state.authenticated} title="Login" hideNavBar={true}/>
            <Scene key="SignUp" component={SignUp} title="Sign Up" hideNavBar={true}/>
            <Scene key="Messenger" component={Messenger} hideNavBar={false} title="Messenger"/>
          </Scene>
        </Router>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

AppRegistry.registerComponent('CheckIn', () => CheckIn);
