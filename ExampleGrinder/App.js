/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SSSA } from '../lib/sssa';
import { generateSecureRandom } from 'react-native-securerandom';
const secret = 'aaA=';
type Props = {};
/**
 * Main App, demonstrating how to use react-native-sssa in a project
 */
export default class App extends Component<Props> {
  state = { randomBits: '', shamirShares: [''], shareLength: 0 };

  /**Runs after component mounts
   * Good place for data fetching
   */
  async componentDidMount() {
    let sssa = new SSSA(3);
    let shares = await sssa.generateShares(secret, 7, 2, 1, 100);
    let combinedShares = sssa.combine(shares);
    this.setState({
      shamirShares: JSON.stringify(shares),
      regeneratedSecret: combinedShares
    });
  }
  /**
   *Renders the App
   *@returns {React.Element} rendered component
   */
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Secret</Text>
        <Text style={styles.instructions}>{secret}</Text>
        <Text testID="shares" style={styles.welcome}>
          Array of shares
        </Text>
        <Text style={styles.instructions}>{this.state.shamirShares}</Text>
        <Text style={styles.welcome}>Regenerated Secret</Text>
        <Text testID="secret" style={styles.instructions}>
          {this.state.regeneratedSecret}
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
