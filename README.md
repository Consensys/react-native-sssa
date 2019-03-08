<h1 align="center">
  React Native SSSA
</h1>

<h4 align="center">
  Shamir's Secret Sharing Algorithm For React-Native
</h4>

<p align="center">
  <a href="#installation">Installation</a> ∙
  <a href="#usage">Usage</a>
</p>

A react-native library for generating cryptographically secure shares of a secret. **Currently only supported and tested on iOS.If you are interested in contributing - [here's an issue to start on](https://github.com/ConsenSys/react-native-sssa/issues/30) ** 

## Installation

```bash
$ yarn add react-native-sssa react-native-securerandom react-native-aes-crypto react-native-secure-storage
$ react-native link
```

[react-native-securerandom](https://github.com/rh389/react-native-securerandom#manual-linking) is used to provide entropy in shamir's secret sharing algorithm 

[react-native-aes-crypto](https://github.com/tectiv3/react-native-aes#Installation) is used to encrypt a file with AES before being processed with SSSA

[react-native-secure-storage](https://github.com/oyyq99999/react-native-secure-storage#manual-installation) is used to securely stored the private key 

## Usage
To put a plain text secret through the entire pipeline (encrypt with. AES, generate shares of the secret with Shamir's Secret Sharing Algorithm, and distribute shares to IPFS (via Infura), use the following:  

```javascript
import {encryptSplitAndSpreadSecret} from 'react-native-sssa';
let ipfsHashes = await encryptSplitAndSpreadSecret(secret,numShares,threshold)
```
To collect shares back from IPFS, use Shamir's secret sharing algorithm to reconstruct the encrypted file, and then decrypt the file back to the plain-text secret, do:

```javascript
import {collectCombineAndDecryptSecret} from 'react-native-sssa';
let secret = await collectCombineAndDecryptSecret(ipfsHashes)
```
If you just want to use Shamir's Secret Sharing Algorithm alone without encryption and IPFS, do the following:

```javascript
import SSSA from 'react-native-sssa';
//This does secret sharing with 3 bit coefficients in the field GF(2^3).
let sssa = new SSSA(3); 
let shares = sssa.generateShares(base64Secret,numShares,threshold);
let secret = sssa.combine(shares);


