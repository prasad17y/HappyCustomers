module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '<rootDir>/jest/setup.js',
    '@testing-library/jest-native/extend-expect',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@react-navigation|redux-persist|react-native-pager-view)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}', // include all app code
    '!src/**/*.d.ts', // exclude type defs
    '!src/**/__tests__/**', // exclude test files
    '!src/**/index.{ts,tsx,js,jsx}', // optional: ignore barrel files
  ],
  coverageReporters: ['text', 'lcov', 'json', 'html'],
};
