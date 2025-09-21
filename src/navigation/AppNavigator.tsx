import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserListScreen from '../screens/UserListScreen';
import AddUserScreen from '../screens/AddUserScreen';
import {RootStackParamList} from './types';
import {Screens} from './routes';
import EditUserScreen from '../screens/EditUserScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Group screenOptions={{headerShown: false}}>
        <RootStack.Screen name={Screens.UserList} component={UserListScreen} />
      </RootStack.Group>
      <RootStack.Group
        screenOptions={{
          presentation: 'fullScreenModal',
          headerShown: false,
        }}>
        <RootStack.Screen name={Screens.AddUser} component={AddUserScreen} />
        <RootStack.Screen name={Screens.EditUser} component={EditUserScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default AppNavigator;
