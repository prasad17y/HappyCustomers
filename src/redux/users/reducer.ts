import {
  UsersState,
  UsersActionTypes,
  SYNC_USERS_REQUEST,
  SYNC_USERS_SUCCESS,
  SYNC_USERS_FAILURE,
  CLEAR_SYNC_ERROR,
} from './types';

const initialState: UsersState = {
  isSyncing: false,
  syncError: null,
  lastSyncTimestamp: null,
};

export const usersReducer = (
  state = initialState,
  action: UsersActionTypes,
): UsersState => {
  switch (action.type) {
    case SYNC_USERS_REQUEST:
      return {
        ...state,
        isSyncing: true,
        syncError: null,
      };
    case SYNC_USERS_SUCCESS:
      return {
        ...state,
        isSyncing: false,
        syncError: null,
        lastSyncTimestamp: action.payload.didFetch
          ? new Date().toISOString()
          : state.lastSyncTimestamp,
      };
    case SYNC_USERS_FAILURE:
      return {
        ...state,
        isSyncing: false,
        syncError: action.payload,
      };
    case CLEAR_SYNC_ERROR:
      return {
        ...state,
        syncError: null,
      };
    default:
      return state;
  }
};
