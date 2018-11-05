module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  modulePathIgnorePatterns: ['/ExampleGrinder/node_modules/react-native'],
  globals: {
    window: true
  },
  testPathIgnorePatterns: ['/node_modules', '/e2e/']
};
