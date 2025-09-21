import {
  UsersState,
  UsersActionTypes,
  SYNC_USERS_REQUEST,
  SYNC_USERS_SUCCESS,
  SYNC_USERS_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  ADD_USER_REQUEST,
  UPDATE_USER_REQUEST,
  SUBMIT_USER_SUCCESS,
  SUBMIT_USER_FAILURE,
  SET_MUTATING,
} from './types';

const initialState: UsersState = {
  isSyncing: false,
  isMutating: false,
  syncError: null,
  lastSyncTimestamp: null,
};

export const usersReducer = (
  state = initialState,
  action: UsersActionTypes,
): UsersState => {
  switch (action.type) {
    case SYNC_USERS_REQUEST:
      return {...state, isSyncing: true, isMutating: true, syncError: null};
    case ADD_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
      return state;

    case SET_MUTATING:
      return {...state, isMutating: action.payload};

    case SYNC_USERS_SUCCESS:
      return {
        ...state,
        isSyncing: false,
        isMutating: false,
        syncError: null,
        lastSyncTimestamp: action.payload.didFetch
          ? new Date().toISOString()
          : state.lastSyncTimestamp,
      };
    case SUBMIT_USER_SUCCESS:
    case DELETE_USER_SUCCESS:
      return {...state, isMutating: false};

    case SYNC_USERS_FAILURE:
      return {
        ...state,
        isSyncing: false,
        isMutating: false,
        syncError: action.payload,
      };
    case SUBMIT_USER_FAILURE:
    case DELETE_USER_FAILURE:
      return {...state, isMutating: false};
    default:
      return state;
  }
};
