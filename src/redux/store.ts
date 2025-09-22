import {createStore, applyMiddleware, Action} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {rootReducer, rootEpic, RootState} from './root';
import {composeWithDevTools} from 'redux-devtools-extension';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['users'],
};

const persistedReducer = persistReducer<RootState, Action>(
  persistConfig,
  rootReducer,
);

const epicMiddleware = createEpicMiddleware<Action, Action, RootState, any>();

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

epicMiddleware.run(rootEpic);
