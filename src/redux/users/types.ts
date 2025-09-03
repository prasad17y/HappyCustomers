export interface UsersState {
  isSyncing: boolean;
  syncError: string | null;
  lastSyncTimestamp: string | null;
}

export const SYNC_USERS_REQUEST = 'SYNC_USERS_REQUEST';
export const SYNC_USERS_SUCCESS = 'SYNC_USERS_SUCCESS';
export const SYNC_USERS_FAILURE = 'SYNC_USERS_FAILURE';
export const CLEAR_SYNC_ERROR = 'CLEAR_SYNC_ERROR';

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

export type UsersActionTypes =
  | SyncUsersRequestAction
  | SyncUsersSuccessAction
  | SyncUsersFailureAction
  | ClearSyncErrorAction;
