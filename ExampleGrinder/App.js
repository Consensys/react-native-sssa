/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/*eslint no-unused-vars: "warn"*/
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { randomBitGenerator } from '../lib/randomBitGenerator.js';
import { bytesToBits } from '../lib/utils';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
});

type Props = {};

export default class App extends Component<Props> {
  state = { randomBits: '' };
  async componentDidMount() {
    let randomNumber = await randomBitGenerator(14);
    this.setState({ randomBits: randomNumber });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text testID="welcome" style={styles.welcome}>
          {this.state.randomBits}
        </Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text testID="randombits" style={styles.instructions}>
          {this.state.randomBits.length}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
