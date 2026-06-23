module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@react-native-async-storage|react-native-image-picker|react-native-vector-icons|tamagui|@tamagui)/)',
  ],
  moduleNameMapper: {
    '\\.(ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
    '^@react-native-clipboard/clipboard$': '<rootDir>/__mocks__/clipboardMock.js',
  },
};
