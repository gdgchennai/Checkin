'use strict';

import React, { Component } from 'react';

import SentMessage from './Messenger/SentMessage';
import ReceivedMessage from './Messenger/ReceivedMessage';
import { Message } from '../Models';
import Icon from 'react-native-vector-icons/Ionicons';
var FilePickerManager = require('NativeModules').FilePickerManager;

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TextInput,
  Image,
} from 'react-native';

class Messenger extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      messages: [],
      message: "",
      file: null,
    };
  }

  componentWillMount() {
    this.getMessages();
  }

  getMessages() {
    Message.lisentToMessages({
      onNewMessage: function(data) {
        this.state.messages.push(data.message);
        this.setState({
          messages: this.state.messages,
        })
      }.bind(this)
    })
  }

  componentWillUnmount() {
    Message.stopLisentingToMessages();
  }

  handleSubmit() {
    if(this.state.message.length > 1) {
      var data = {
        message: this.state.message,
        sender_id: this.props.user_id,
      };
      Message.sendMessage({
        data: data,
        file: this.state.file,
        onSuccess: function() {
          this.setState({
            message: "",
            file: null,
          })
        }.bind(this),
      })
    }
  }

  addImage() {
    var file_options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    FilePickerManager.showFilePicker(file_options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled file picker');
      }
      else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      }
      else {
        this.setState({
          file: response
        });
      }
    });
  }

  renderMessage(message, index) {
     if (message.sender_id == this.props.user_id) {
      return <SentMessage message={message}  key={index} />;
    } else {
      return <ReceivedMessage message={message} key={index} />;
    }
  }


  render() {
    var image;
    if (this.state.file) {
      image = <Text>{"Attached " + this.state.file.fileName }</Text>
    }
    return (
      <View style={styles.mainContainer}>
        <ScrollView 
          style={styles.chat_area}>
          {this.state.messages.map(this.renderMessage.bind(this))}
        </ScrollView>
        {image}
        <View style={styles.message_box}>
          <TouchableHighlight onPress={this.addImage.bind(this)} style={styles.submitBtn}>
            <Image
              style={styles.send_icon}  
              source={require('../Resources/Icons/image.png')} />
          </TouchableHighlight>  
          <TextInput
            style={styles.send_input}
            placeholder="Type your message..."
            placeholderTextColor="#fff"
            returnKeyType="send"
            value={this.state.message}
            onChangeText={message => this.setState({message})}
            underlineColorAndroid="#fff"/>
          <TouchableHighlight onPress={this.handleSubmit.bind(this)} style={styles.submitBtn}>
            <Image 
              style={styles.send_icon} 
              source={require('../Resources/Icons/send.png')}
            />
          </TouchableHighlight>     
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 60,
    flexDirection: "column",
  },  
  chat_area: {
    flex: 1,
  },
  send_input: {
    flexGrow: 1,
    fontSize: 15,
    color: '#fff',
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
  message_box: {
    backgroundColor: "#9146A7",
    flexDirection: "row",
    height: 50,
  },
  submitBtn: {
    alignSelf: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  send_icon: {
    width: 20,
    height: 20,
  },
  attachment: {
    height: 100,
    width: 200,
    flex: 1,
  }
});


export default Messenger;