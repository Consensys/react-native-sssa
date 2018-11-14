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

A library to generate cryptographically secure shares of a secret.

## Installation

```bash
$ yarn add react-native-sssa react-native-securerandom react-native-aes-crypto react-native-secure-storage
$ react-native link
```

[react-native-securerandom] is used to provide entropy in shamir's secret sharing algorithm 

[react-native-aes-crypto] is used to encrypt a file with AES before being encrypted with SSSA

[react-native-secure-storage] is used to securely stored the private key 

If need be,
their documentation provides instructions for manual linking:  
[react-native-securerandom](https://github.com/rh389/react-native-securerandom#manual-linking)  
[react-native-secure-storage](https://github.com/oyyq99999/react-native-secure-storage#manual-installation)  
[react-native-aes-crypto] (https://github.com/tectiv3/react-native-aes#Installation)
## Usage

