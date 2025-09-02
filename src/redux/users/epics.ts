import {Epic} from 'redux-observable';
import {of, from} from 'rxjs';
import {
  filter,
  switchMap,
  map,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';
import {SYNC_USERS_REQUEST, UsersActionTypes} from './types';
import {syncUsersSuccess, syncUsersFailure} from './actions';
import {syncData} from '../../db/actions';
import {RootState} from '../root';
import {database} from '../../db';
import UserModel from '../../db/models/UserModel';

const STALE_PERIOD_MS = 10000; // 10 seconds for testing

export const usersEpic: Epic<UsersActionTypes, UsersActionTypes, RootState> = (
  action$,
  state$,
) =>
  action$.pipe(
    filter(action => action.type === SYNC_USERS_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const forceRefresh = action.payload?.forceRefresh || false;
      const {lastSyncTimestamp} = state.users;

      return from(shouldSync(forceRefresh, lastSyncTimestamp)).pipe(
        switchMap(shouldSync => {
          if (shouldSync) {
            return from(syncData()).pipe(
              map(() => syncUsersSuccess({didFetch: true})),
              catchError(err => of(syncUsersFailure(err.message))),
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
