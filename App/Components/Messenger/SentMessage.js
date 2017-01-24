'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

class SentMessage extends Component {
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
        <View style={styles.chat}>
          <Text style={styles.chat_text}> {this.props.message.message} </Text>
          {image}
        </View> 
      </View>
    );
  }
}


const styles = StyleSheet.create({ 
  chat_container: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  chat: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#9146A7",
  },
  chat_text: {
    color: '#fff',
    fontWeight: "600",
    fontSize: 13,
  },
  attachment: {
    height: 100,
    width: 200,
    flex: 1,
  }
});


export default SentMessage;