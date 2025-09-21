import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  UserList: undefined;
  AddUser: undefined;
  EditUser: {userId: string};
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
