import {usersReducer} from '../reducer';
import {
  syncUsersRequest,
  syncUsersSuccess,
  syncUsersFailure,
  deleteUserRequest,
  deleteUserSuccess,
  addUserRequest,
  submitUserFailure,
  setMutating,
} from '../actions';
import {UsersState} from '../types';
import {REHYDRATE} from 'redux-persist';

// Define the initial state for reference in tests
const initialState: UsersState = {
  isSyncing: false,
  isMutating: false,
  syncError: null,
  lastSyncTimestamp: null,
};

describe('usersReducer', () => {
  it('should return the initial state', () => {
    expect(usersReducer(undefined, {} as any)).toEqual(initialState);
  });

  it('should handle REHYDRATE with a valid payload', () => {
    const persistedState: UsersState = {
      isSyncing: true, // This should be reset
      isMutating: true, // This should be reset
      syncError: 'An old error', // This should be reset
      lastSyncTimestamp: '2025-01-01T00:00:00.000Z', // This should be kept
    };

    const rehydrateAction = {
      type: REHYDRATE,
      payload: {users: persistedState},
    };

    const newState = usersReducer(initialState, rehydrateAction as any);

    expect(newState.lastSyncTimestamp).toBe(persistedState.lastSyncTimestamp);
    expect(newState.isSyncing).toBe(false);
    expect(newState.isMutating).toBe(false);
    expect(newState.syncError).toBeNull();
  });

  it('should handle REHYDRATE with a missing payload and not change state', () => {
    const rehydrateAction = {
      type: REHYDRATE,
      payload: {}, // No `users` key
    };

    const newState = usersReducer(initialState, rehydrateAction as any);
    expect(newState).toEqual(initialState);
  });

  it('should handle SYNC_USERS_REQUEST', () => {
    const newState = usersReducer(initialState, syncUsersRequest());
    expect(newState.isSyncing).toBe(true);
    // Sync request should NOT acquire the mutation lock itself
    expect(newState.isMutating).toBe(false);
  });

  it('should handle SYNC_USERS_SUCCESS when a fetch occurred', () => {
    const busyState = {...initialState, isSyncing: true, isMutating: true};
    const action = syncUsersSuccess({didFetch: true});
    const newState = usersReducer(busyState, action);
    expect(newState.isSyncing).toBe(false);
    expect(newState.isMutating).toBe(false);
    expect(newState.lastSyncTimestamp).not.toBeNull();
  });

  it('should handle SYNC_USERS_SUCCESS when no fetch occurred', () => {
    const busyState = {...initialState, isSyncing: true, isMutating: false};
    const action = syncUsersSuccess({didFetch: false});
    const newState = usersReducer(busyState, action);
    expect(newState.isSyncing).toBe(false);
    expect(newState.isMutating).toBe(false);
    expect(newState.lastSyncTimestamp).toBeNull();
  });

  it('should handle SYNC_USERS_FAILURE', () => {
    const busyState = {...initialState, isSyncing: true, isMutating: true};
    const action = syncUsersFailure('Network Error');
    const newState = usersReducer(busyState, action);
    expect(newState.isSyncing).toBe(false);
    expect(newState.isMutating).toBe(false);
    expect(newState.syncError).toBe('Network Error');
  });

  it('should handle DELETE_USER_REQUEST by doing nothing to the state', () => {
    const action = deleteUserRequest({userId: '1', userName: 'Test'});
    const newState = usersReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it('should handle ADD_USER_REQUEST by doing nothing to the state', () => {
    const action = addUserRequest({firstName: 'Test', lastName: 'User'});
    const newState = usersReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it('should handle SET_MUTATING to acquire the lock', () => {
    const action = setMutating(true);
    const newState = usersReducer(initialState, action);
    expect(newState.isMutating).toBe(true);
  });

  it('should handle DELETE_USER_SUCCESS to release the lock', () => {
    const busyState = {...initialState, isMutating: true};
    const action = deleteUserSuccess();
    const newState = usersReducer(busyState, action);
    expect(newState.isMutating).toBe(false);
  });

  it('should handle SUBMIT_USER_FAILURE to release the lock', () => {
    const busyState = {...initialState, isMutating: true};
    const action = submitUserFailure();
    const newState = usersReducer(busyState, action);
    expect(newState.isMutating).toBe(false);
  });
});
