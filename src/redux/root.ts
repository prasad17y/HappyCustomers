import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {usersReducer} from './users/reducer';
import {usersEpic} from './users/epics';

const usersPersistConfig = {
  key: 'users',
  storage: AsyncStorage,
  whitelist: ['lastSyncTimestamp'],
};

export const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
});

export const rootEpic = combineEpics(usersEpic);

export type RootState = ReturnType<typeof rootReducer>;
