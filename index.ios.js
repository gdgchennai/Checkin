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
import { User } from './App/Models';
import {Scene, Router} from 'react-native-router-flux';

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
