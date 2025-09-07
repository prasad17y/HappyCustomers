jest.mock('redux-persist/integration/react', () => {
  return {
    PersistGate: ({children}) => children, // render children directly
  };
});

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistStore: jest.fn(() => ({
      purge: jest.fn(),
      flush: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    })),
  };
});

jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      schema: {
        tables: {
          users: {},
        },
      },
      migrations: {},
      getDatabase: jest.fn(),
      batch: jest.fn(),
    })),
  };
});

// Mock for WatermelonDB's underlying storage
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(callback =>
      callback({
        executeSql: jest.fn(),
      }),
    ),
  })),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock for react-native-toast-message
jest.mock('react-native-toast-message', () => {
  // Mock the component part of the library
  const Toast = props => {
    return null;
  };
  // Mock the imperative API
  Toast.show = jest.fn();
  Toast.hide = jest.fn();
  return {
    __esModule: true,
    default: Toast,
  };
});
