import {renderHook} from '@testing-library/react-native';
import {useUsers} from '../useUsers';
import {database} from '../../db';
import {of, throwError} from 'rxjs';
import {Role} from '../../types/types';

// Mock the database and its query observe method
const mockObserve = jest.fn();
jest.mock('../../db', () => ({
  database: {
    collections: {
      get: () => ({
        query: () => ({
          observe: mockObserve,
        }),
      }),
    },
  },
}));

// Mock the useIsFocused hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: () => true,
}));

describe('useUsers', () => {
  const mockUsers = [
    {id: '1', name: 'Alice Admin', role: Role.ADMIN, email: null},
    {id: '2', name: 'Bob Manager', role: Role.MANAGER, email: null},
  ];

  beforeEach(() => {
    mockObserve.mockClear();
  });

  it('should return users when the subscription emits data', () => {
    // Arrange: Mock the observable to return a list of users
    mockObserve.mockReturnValue(of(mockUsers));

    // Act: Render the hook
    const {result} = renderHook(() => useUsers());

    // Assert: The hook should return the users and no error
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeUndefined();
  });

  it('should return undefined initially before the first emission', () => {
    // Arrange: Mock an empty observable that hasn't emitted yet
    mockObserve.mockReturnValue(of());

    // Act: Render the hook
    const {result} = renderHook(() => useUsers());

    // Assert: The initial state should be undefined
    expect(result.current.users).toBeUndefined();
  });

  it('should return an error if the subscription throws an error', () => {
    // Arrange: Mock the observable to throw an error
    const mockError = new Error('Database query failed');
    mockObserve.mockReturnValue(throwError(() => mockError));

    // Act: Render the hook
    const {result} = renderHook(() => useUsers());

    // Assert: The hook should return the error
    expect(result.current.users).toBeUndefined();
    expect(result.current.error).toBe(mockError);
  });

  it('should not fetch data if isEnabled is false', () => {
    mockObserve.mockReturnValue(of(mockUsers));

    const {result} = renderHook(() => useUsers(undefined, undefined, false));

    // The database observe function should not be called
    expect(mockObserve).not.toHaveBeenCalled();
    // The hook should return its initial undefined state
    expect(result.current.users).toBeUndefined();
  });

  it('should re-fetch when roleFilter or searchQuery props change', () => {
    mockObserve.mockReturnValue(of(mockUsers));

    const {rerender} = renderHook(
      ({role, search}) => useUsers(role, search, true),
      {initialProps: {role: undefined, search: undefined}},
    );

    // The hook should have been called once on the initial render
    expect(mockObserve).toHaveBeenCalledTimes(1);

    // Rerender with a new role to trigger the useEffect
    rerender({role: Role.ADMIN, search: undefined});

    // The observe function should have been called again
    expect(mockObserve).toHaveBeenCalledTimes(2);

    // Rerender with a new search query to trigger the useEffect
    rerender({role: Role.ADMIN, search: 'Alice'});

    // The observe function should have been called a third time
    expect(mockObserve).toHaveBeenCalledTimes(3);
  });
});
