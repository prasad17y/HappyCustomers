import {
  SYNC_USERS_REQUEST,
  SYNC_USERS_SUCCESS,
  SYNC_USERS_FAILURE,
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
