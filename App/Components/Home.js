'use strict';

import React, { Component } from 'react';
import { User } from '../Models';
import { Actions } from 'react-native-router-flux';
import { CommonStyle } from '../Styles';
import Button from './Common/Button';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';

import CheckIn from './CheckIn';

class Home extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      checkedIn: false,
      loading: true,
      users: [],
      checkingIn: false,
      user_id: null,
    };
  }

  componentWillMount() {
    User.isCheckedIn({
      onSuccess: function(data) {
        this.setState({
          user_id: data.user_id,
          checkedIn: data.checkedIn,
          loading: false,
        });
        this.getCheckedInUsers();
      }.bind(this)
    })
  }

  logout() {
    User.logoutUser({
      onSuccess: function(data) {
        if (data.loggedOut) {
          Actions.Login();
        }
      }.bind(this)
    })
  }
  
  _checkIn() {
    this.setState({
      checkingIn: true,
    })
    User.checkIn({
      onSuccess: function(data) {
        this.setState({
          checkedIn: data.checkedIn,
          loading: false,
          checkingIn: false,
        });
        this.getCheckedInUsers();
      }.bind(this)
    })
  }

  getCheckedInUsers() {
    if (this.state.checkedIn) {
      User.getCheckIns({
        onSuccess: function(data) {
          this.state.users.push(data.user);
          this.setState({
            users: this.state.users,
          })
        }.bind(this)
      })
    }
  }
  
  openMessenger() {
    Actions.Messenger({title: "Messenger", user_id: this.state.user_id});
  }

  renderUser(user, index) {
    return <CheckIn key={index} user={user}/>;
  }

  render() {
    if (this.state.loading) {
      return (
          <Image
          source={require('../Resources/pattern.png')}
          style={styles.mainContainer}>
            <ActivityIndicator
              animating={this.state.loading}
              style={[styles.centering, {height: 80}]}
              size="large"
            />
          </Image>
        )
    } else if (!this.state.checkedIn) {
      return (
        <Image
          source={require('../Resources/pattern.png')}
          style={styles.mainContainer}>
          <View style={styles.pageArea}>
            <Text style={styles.pageTitle}>Click here to check-in</Text>
            <View
              style={styles.iconContainer}>
              <Image
                style={styles.checkInIcon}
                source={require('../Resources/checkin_icon.png')}
              />
            </View>
            <Button 
              onPress={this._checkIn.bind(this)}
              loading={this.state.checkingIn}
              message="CheckIn"
            />
          </View>
        </Image>
      );
    } else {
      return (
          <Image
          source={require('../Resources/pattern.png')}
          style={styles.mainContainer}>
            <View style={styles.pageArea}>
              <Text style={styles.pageTitle}>People Currently Available</Text>
              {this.state.users.map(this.renderUser.bind(this))}
              <Button 
                onPress={this.openMessenger.bind(this)}
                loading={false}
                message="Open Chat"
              />
              <Button 
                onPress={this.logout.bind(this)}
                loading={false}
                message="Logout"
              />
            </View>
          </Image>
        )
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: null,
    width: null,
  },
  pageArea: {
    flex: 1,
    padding: 35,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "200",
    paddingBottom: 20,
  },
  centering:{
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInIcon: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
  }
});


export default Home;