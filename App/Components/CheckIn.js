'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import gravatar from 'gravatar';

class CheckIn extends Component {
  render() {
    return (
      <View style={styles.checkInBlock}>
        <Image 
          style={styles.avatar}
          source={{uri: "https:" + gravatar.url(this.props.user.email)}} />
        <Text style={styles.name}>{this.props.user.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkInBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  name: {
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: '300',
  }
});


export default CheckIn;