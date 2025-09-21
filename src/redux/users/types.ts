export interface UsersState {
  isSyncing: boolean; // For fetching and storing data
  isMutating: boolean; // used as lock for all mutations
  syncError: string | null;
  lastSyncTimestamp: string | null;
}

export const SYNC_USERS_REQUEST = 'SYNC_USERS_REQUEST';
export const SYNC_USERS_SUCCESS = 'SYNC_USERS_SUCCESS';
export const SYNC_USERS_FAILURE = 'SYNC_USERS_FAILURE';
export const CLEAR_SYNC_ERROR = 'CLEAR_SYNC_ERROR';

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const ADD_USER_REQUEST = 'ADD_USER_REQUEST';
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const SUBMIT_USER_SUCCESS = 'SUBMIT_USER_SUCCESS';
export const SUBMIT_USER_FAILURE = 'SUBMIT_USER_FAILURE';

export const SET_MUTATING = 'SET_MUTATING';

interface SyncUsersRequestAction {
  type: typeof SYNC_USERS_REQUEST;
  payload?: {forceRefresh: boolean};
}

interface SyncUsersSuccessAction {
  type: typeof SYNC_USERS_SUCCESS;
  payload: {didFetch: boolean};
}

interface SyncUsersFailureAction {
  type: typeof SYNC_USERS_FAILURE;
  payload: string;
}

interface ClearSyncErrorAction {
  type: typeof CLEAR_SYNC_ERROR;
}

interface DeleteUserRequestAction {
  type: typeof DELETE_USER_REQUEST;
  payload: {userId: string; userName: string};
}

interface DeleteUserSuccessAction {
  type: typeof DELETE_USER_SUCCESS;
}

interface DeleteUserFailureAction {
  type: typeof DELETE_USER_FAILURE;
}

interface AddUserRequestAction {
  type: typeof ADD_USER_REQUEST;
  payload: any;
}

interface UpdateUserRequestAction {
  type: typeof UPDATE_USER_REQUEST;
  payload: any;
}

interface SubmitUserSuccessAction {
  type: typeof SUBMIT_USER_SUCCESS;
}

interface SubmitUserFailureAction {
  type: typeof SUBMIT_USER_FAILURE;
}

interface SetMutatingAction {
  type: typeof SET_MUTATING;
  payload: boolean;
}

export type UsersActionTypes =
  | SyncUsersRequestAction
  | SyncUsersSuccessAction
  | SyncUsersFailureAction
  | ClearSyncErrorAction
  | DeleteUserRequestAction
  | DeleteUserSuccessAction
  | DeleteUserFailureAction
  | AddUserRequestAction
  | UpdateUserRequestAction
  | SubmitUserSuccessAction
  | SubmitUserFailureAction
  | SetMutatingAction;
