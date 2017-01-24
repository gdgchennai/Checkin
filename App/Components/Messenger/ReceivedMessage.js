'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import gravatar from 'gravatar';


class ReceivedMessage extends Component {
  render() {
    var image;
    if (this.props.message.image_url) {
      image = <Image 
                resizeMode="cover"
                style={styles.attachment}
                source={{uri: this.props.message.image_url}}
              />
    }
    return (
      <View style={styles.chat_container}>
        <Text style={styles.senderInfo}>
          {this.props.message.sender.name}
        </Text>
        <View style={styles.chat}>
          <Text style= {styles.chat_text}> {this.props.message.message} </Text>
          {image}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chat_container: {
    marginLeft: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingBottom: 3,
    paddingTop: 3,
  },
  chat: {
    borderRadius: 5,
    padding: 6,
    backgroundColor: '#786ECD',
  },
  chat_text: {
    color: '#fff',
    fontWeight: "600",
    fontSize: 13,
  },
  senderInfo: {
    fontSize: 12,
    fontWeight: '500',
  },
  img: {
    height: 35,
    width: 35,
    borderRadius: 17,
    marginRight: 10,
  },
  attachment: {
    height: 100,
    width: 200,
  }
});


export default ReceivedMessage;