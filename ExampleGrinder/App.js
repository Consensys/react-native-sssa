/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/*eslint no-unused-vars: "warn"*/
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { encryptAndSplitSecret, combineAndDecryptSecret } from '../index';
import { getFromIPFS, storeToIPFS } from '../lib/remoteStorage.js';
const secret = 's';
type Props = {};
/**
 * Main App, demonstrating how to use react-native-sssa in a project
 */
export default class App extends Component<Props> {
  state = { shares: '', ipfsLocations: '', finalSecret: '' };

  /**Runs after component mounts
   * Good place for data fetching
   */
  async componentDidMount() {
    let sharesAndIv = await encryptAndSplitSecret(secret, 5, 5);
    let ipfsLocations = await storeToIPFS(sharesAndIv.shares);
    let sharesFromIPFS = await getFromIPFS(ipfsLocations);
    let combinedAndDecryptedSecret = await combineAndDecryptSecret(
      sharesAndIv.shares,
      sharesAndIv.iv
    );
    this.setState({
      shares: sharesAndIv.shares,
      finalSecret: combinedAndDecryptedSecret
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
        <Text style={styles.instructions}>{this.state.shares}</Text>
        <Text style={styles.welcome}>Secret Again!!</Text>
        <Text style={styles.instructions}>{this.state.finalSecret}</Text>
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
