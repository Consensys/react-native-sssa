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

This package relies on [react-native-securerandom](https://github.com/rh389/react-native-securerandom) to provide entropy in shamir's secret sharing algorithm, [react-native-aes-crypto] to provide encryption to secret before being processed by sssa, and [react-native-secure-storage] to safetly store and retrieve private key
It has native dependencies that need linking. If need be,
their documentation provides instructions for [manual linking](https://github.com/rh389/react-native-securerandom#manual-linking)

## Usage
