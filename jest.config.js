module.exports = {
  preset: 'react-native',
  rootDir: './ExampleGrinder',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  globals: {
    window: true
  },
  testPathIgnorePatterns: ['/node_modules', '/e2e/']
};
