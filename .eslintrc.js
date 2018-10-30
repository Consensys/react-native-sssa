module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
    jasmine: true,
    mocha: true
  },
  globals: {
    __dev__: false
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react', 'react-native', 'jasmine', 'detox'],
  settings: {
    react: {
      pragma: 'react',
      version: '16.5.0'
    }
  },
  rules: {
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars':'off'
  }
};
