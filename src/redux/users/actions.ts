import {
  SYNC_USERS_REQUEST,
  SYNC_USERS_SUCCESS,
  SYNC_USERS_FAILURE,
  CLEAR_SYNC_ERROR,
  UsersActionTypes,
} from './types';

export const syncUsersRequest = (payload?: {
  forceRefresh: boolean;
}): UsersActionTypes => ({
  type: SYNC_USERS_REQUEST,
  payload,
});

export const syncUsersSuccess = (payload: {
  didFetch: boolean;
}): UsersActionTypes => ({
  type: SYNC_USERS_SUCCESS,
  payload,
});

export const syncUsersFailure = (error: string): UsersActionTypes => ({
  type: SYNC_USERS_FAILURE,
  payload: error,
});

export const clearSyncError = (): UsersActionTypes => ({
  type: CLEAR_SYNC_ERROR,
});
