import {RootStackParamList} from './types';

export type ScreenName = keyof RootStackParamList;

export const Screens: Record<ScreenName, ScreenName> = {
  UserList: 'UserList',
  AddUser: 'AddUser',
};
