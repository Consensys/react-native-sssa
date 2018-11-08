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
import { SSSA } from '../lib/sssa';
import { base64ToBits, bin2hex } from '../lib/utils';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
});

type Props = {};

export default class App extends Component<Props> {
  state = { randomBits: '', shamirShares: [''], shareLength: 0 };
  async componentDidMount() {
    let randomNumber = await randomBitGenerator(14);

    let sssa = new SSSA(3);
    let secret = 'aaA=';

    let shares = await sssa.generateShares(secret, 7, 2, 1);
    length = parseInt(shares[0], 16).toString(2).length;
    isLengthCorrect = length === this.verifyLengthOfShare(secret, 3);
    //    let combinedShares = sssa.combine(shares);

    this.setState({
      randomBits: randomNumber,
      shamirShares: shares,
      shareLengthIsCorrect: isLengthCorrect
    });
  }
  verifyLengthOfShare(secret, coeffLength) {
    var secretLengthInBits = base64ToBits(secret);
    var expectedLength =
      (Math.ceil(secretLengthInBits.length / coeffLength) + 1) * coeffLength;
    return expectedLength;
  }
  render() {
    console.warn('hello');
    return (
      <View style={styles.container}>
        <Text testID="welcome" style={styles.welcome}>
          {this.state.randomBits}
        </Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text testID="randombits" style={styles.instructions}>
          {this.state.randomBits.length}
        </Text>
        <Text testID="shares" style={styles.instructions}>
          {this.state.shamirShares.length}
        </Text>
        <Text testID="oneShare" style={styles.instructions}>
          {this.state.shareLengthIsCorrect ? 'true' : 'false'}
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
