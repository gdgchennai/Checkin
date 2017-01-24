'use strict';

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';

import { User } from '../Models';
import Home from './Home';
import SignUp from './SignUp';

import { CommonStyle } from '../Styles';
import Button from './Common/Button';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loggingIn: false,
      facebookLoggingIn: false,
    };
  }

  goToSignUp() {
    Actions.SignUp();
  }

  handleSubmit() {
    var email = this.state.email.trim(),
        password = this.state.password.trim();

    if (email != "" && password != "") {
      this.setState({
        loggingIn: true,
      })
      User.signInWithEmail({
        data: {
          email: email,
          password: password,
        },
        onSuccess: function(data) {
          this.setState({
            loggingIn: true,
          })
          Actions.Home();
        }.bind(this),
        onError: function(data) {
          alert(data.message);
        }.bind(this),
      })
    } 
  }

  /**
  * Handles Facebook Login 
  */
  handleFacebookLogin() {
    this.setState({
      facebookLoggingIn: true,
    })
    User.facebookLogin({
      data: true,
      onSuccess: function() {
        this.setState({
          facebookLoggingIn: false,
        })
        Actions.Home();
      }.bind(this),
      onError: function() {
        this.setState({
          facebookLoggingIn: false,
        })
        alert("Login Failed");
      }
    })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello</Text>
          <Text style={styles.welcomeSubText}>Welcome to the demo!</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login to continue</Text>
          <View style={CommonStyle.textInputContainer}>
            <Text style={CommonStyle.textInputLabel}>E-MAIL</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={CommonStyle.textInput}
              onChange={(event) => this.setState({
                email: event.nativeEvent.text,
              })}
            />
          </View>
          <View style={CommonStyle.textInputContainer}>
            <Text style={CommonStyle.textInputLabel}>PASSWORD</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={CommonStyle.textInput}
              secureTextEntry={true}
              onChange={(event) => this.setState({
                password: event.nativeEvent.text,
              })}
            />
          </View>
          <Button 
            onPress={this.handleSubmit.bind(this)}
            loading={this.state.loggingIn}
            message="LOGIN"
          />
          <Button 
            onPress={this.handleFacebookLogin.bind(this)}
            loading={this.state.facebookLoggingIn}
            message="LOGIN WITH FACEBOOK"
          />
          <TouchableHighlight 
            onPress={this.goToSignUp.bind(this)}
            style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          </TouchableHighlight>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 35,
    paddingTop: 100,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "200",
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: "400",
    paddingBottom: 20,
  },
  welcomeSubText: {
    fontSize: 20,
    fontWeight: "200",
    paddingBottom: 20,
  },
  signUpButton: {
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#9146A7',
    textAlign: 'center',
  },
});


export default Login;