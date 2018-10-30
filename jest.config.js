module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  globals: {
    window: true
  },
  testPathIgnorePatterns: [
    '/node_modules',
    '/e2e/',
    '/RNSecureRandom/__tests__/'
  ]
};
