import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {usersReducer} from './users/reducer';
import {
  addUserEpic,
  deleteUserEpic,
  updateUserEpic,
  usersEpic,
} from './users/epics';
import {notificationsReducer} from './notifications/reducer';

const usersPersistConfig = {
  key: 'users',
  storage: AsyncStorage,
  whitelist: ['lastSyncTimestamp'],
};

export const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
  notifications: notificationsReducer,
});

export const rootEpic = combineEpics(
  usersEpic,
  deleteUserEpic,
  addUserEpic,
  updateUserEpic,
);

export type RootState = ReturnType<typeof rootReducer>;
