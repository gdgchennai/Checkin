'use strict';

import React, { Component } from 'react';
import { CommonStyle } from '../../Styles';

import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

class Button extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      loading: this.props.loading,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.loading != nextProps.loading) {
      this.setState({
        loading: nextProps.loading
      })
    }  
  }

  render() {
    if (this.state.loading) {
      return (
          <View style={CommonStyle.Button}>
            <ActivityIndicator
              animating={this.state.loading}
              style={[styles.centering, {height: 80}]}
              size="small"
              color="white"
            />
          </View>
        )
    }
    return (
      <TouchableHighlight 
        onPress={this.props.onPress}
        style={CommonStyle.Button}>
        <Text style={CommonStyle.ButtonText}>{this.props.message}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({

});


export default Button;