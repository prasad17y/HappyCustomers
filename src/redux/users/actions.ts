import {
  SYNC_USERS_REQUEST,
  SYNC_USERS_SUCCESS,
  SYNC_USERS_FAILURE,
  CLEAR_SYNC_ERROR,
  UsersActionTypes,
  DELETE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  ADD_USER_REQUEST,
  SUBMIT_USER_FAILURE,
  SUBMIT_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  SET_MUTATING,
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

export const deleteUserRequest = (payload: {
  userId: string;
  userName: string;
}): UsersActionTypes => ({
  type: DELETE_USER_REQUEST,
  payload,
});

export const deleteUserSuccess = (): UsersActionTypes => ({
  type: DELETE_USER_SUCCESS,
});

export const deleteUserFailure = (): UsersActionTypes => ({
  type: DELETE_USER_FAILURE,
});

export const addUserRequest = (payload: any): UsersActionTypes => ({
  type: ADD_USER_REQUEST,
  payload,
});

export const updateUserRequest = (payload: any): UsersActionTypes => ({
  type: UPDATE_USER_REQUEST,
  payload,
});

export const submitUserSuccess = (): UsersActionTypes => ({
  type: SUBMIT_USER_SUCCESS,
});

export const submitUserFailure = (): UsersActionTypes => ({
  type: SUBMIT_USER_FAILURE,
});

export const setMutating = (isMutating: boolean): UsersActionTypes => ({
  type: SET_MUTATING,
  payload: isMutating,
});
