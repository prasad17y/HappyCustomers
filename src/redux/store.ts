import {createStore, applyMiddleware, Action} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {rootReducer, rootEpic} from './root';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['users'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const epicMiddleware = createEpicMiddleware<Action, Action, any, any>();

export const store = createStore(
  persistedReducer,
  applyMiddleware(epicMiddleware),
);

export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);
