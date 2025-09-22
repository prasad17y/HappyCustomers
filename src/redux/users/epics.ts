import {Epic} from 'redux-observable';
import {of, from, concat} from 'rxjs';
import {
  filter,
  switchMap,
  map,
  catchError,
  withLatestFrom,
  mergeMap,
} from 'rxjs/operators';
import {Action} from 'redux';
import {
  SYNC_USERS_REQUEST,
  DELETE_USER_REQUEST,
  ADD_USER_REQUEST,
  UPDATE_USER_REQUEST,
} from './types';
import {
  syncUsersSuccess,
  syncUsersFailure,
  deleteUserSuccess,
  deleteUserFailure,
  submitUserSuccess,
  submitUserFailure,
  setMutating,
} from './actions';
import {showToast} from '../notifications/actions';
import {syncData, deleteUser, addUser, updateUser} from '../../db/actions';
import {RootState} from '../root';
import {database} from '../../db';
import UserModel from '../../db/models/UserModel';

const STALE_PERIOD_MS = 60 * 1000; // 1 minute for testing

const BUSY_ERROR_TOAST = showToast({
  message: 'Operation in progress. Please try again later.',
  type: 'error',
});

export const usersEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === SYNC_USERS_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const forceRefresh = (action as any).payload?.forceRefresh || false;
      const {lastSyncTimestamp} = state.users;

      return from(shouldSync(forceRefresh, lastSyncTimestamp)).pipe(
        switchMap(shouldSync => {
          if (shouldSync) {
            if (state.users.isMutating) {
              return of(BUSY_ERROR_TOAST);
            }
            return concat(
              of(setMutating(true)),
              from(syncData()).pipe(
                map(() => syncUsersSuccess({didFetch: true})),
                catchError(err => of(syncUsersFailure(err.message))),
              ),
            );
          }
          return of(syncUsersSuccess({didFetch: false}));
        }),
      );
    }),
  );

const shouldSync = async (
  forceRefresh: boolean,
  lastSyncTimestamp: string | null,
) => {
  if (forceRefresh) {
    console.log('Sync forced by user action.');
    return true;
  }

  const userCount = await database.collections
    .get<UserModel>('users')
    .query()
    .fetchCount();
  if (userCount === 0) {
    console.log('Sync required: No local data.');
    return true;
  }

  if (!lastSyncTimestamp) {
    console.log('Sync required: No last sync timestamp found.');
    return true;
  }

  const isStale =
    new Date().getTime() - new Date(lastSyncTimestamp).getTime() >
    STALE_PERIOD_MS;

  if (isStale) {
    console.log('Sync required: Data is stale.');
  } else {
    console.log('Sync not required: Data is fresh.');
  }
  return isStale;
};

export const deleteUserEpic: Epic<Action, Action, RootState> = (
  action$,
  state$,
) =>
  action$.pipe(
    filter(action => action.type === DELETE_USER_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      if (state.users.isMutating) {
        return of(BUSY_ERROR_TOAST);
      }
      const {userId, userName} = (action as any).payload;
      return concat(
        of(setMutating(true)), // get the lock
        from(deleteUser(userId)).pipe(
          mergeMap(() =>
            of(
              deleteUserSuccess(), // release the lock
              showToast({
                message: `User "${userName}" deleted.`,
                type: 'success',
              }),
            ),
          ),
          catchError(() =>
            of(
              deleteUserFailure(), // release the lock
              showToast({
                message: `Failed to delete "${userName}".`,
                type: 'error',
              }),
            ),
          ),
        ),
      );
    }),
  );

export const addUserEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === ADD_USER_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      if (state.users.isMutating) {
        return of(BUSY_ERROR_TOAST);
      }
      return concat(
        of(setMutating(true)),
        from(addUser((action as any).payload)).pipe(
          mergeMap(() =>
            of(
              submitUserSuccess(),
              showToast({
                message: 'User created successfully!',
                type: 'success',
              }),
            ),
          ),
          catchError(() =>
            of(
              submitUserFailure(),
              showToast({message: 'Could not create user.', type: 'error'}),
            ),
          ),
        ),
      );
    }),
  );

export const updateUserEpic: Epic<Action, Action, RootState> = (
  action$,
  state$,
) =>
  action$.pipe(
    filter(action => action.type === UPDATE_USER_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      if (state.users.isMutating) {
        return of(BUSY_ERROR_TOAST);
      }
      return concat(
        of(setMutating(true)),
        from(updateUser((action as any).payload)).pipe(
          mergeMap(() =>
            of(
              submitUserSuccess(),
              showToast({
                message: 'User updated successfully!',
                type: 'success',
              }),
            ),
          ),
          catchError(() =>
            of(
              submitUserFailure(),
              showToast({message: 'Could not update user.', type: 'error'}),
            ),
          ),
        ),
      );
    }),
  );
