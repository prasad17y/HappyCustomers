import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from '../AppNavigator';
// import {Text, TouchableOpacity} from 'react-native';

// Mock all the screen components to be simple placeholders
jest.mock('../../screens/UserListScreen', () => {
  const React = require('react');
  const {Text, TouchableOpacity} = require('react-native');
  const {useNavigation} = require('@react-navigation/native');
  return () => {
    const navigation = useNavigation();
    return (
      <>
        <Text>User List Screen</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddUser')}>
          <Text>Go to Add User</Text>
        </TouchableOpacity>
      </>
    );
  };
});
jest.mock('../../screens/AddUserScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return () => <Text>Add User Screen</Text>;
});
jest.mock('../../screens/EditUserScreen', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return () => <Text>Edit User Screen</Text>;
});

describe('AppNavigator', () => {
  it('should render the initial UserList screen', () => {
    render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>,
    );

    // Verify that the text from our mocked UserListScreen is visible
    expect(screen.getByText('User List Screen')).toBeTruthy();
  });

  it('should navigate to the AddUser screen when triggered', () => {
    render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>,
    );

    // Ensure the initial screen is visible
    expect(screen.getByText('User List Screen')).toBeTruthy();

    // Simulate a press on the button inside our mocked UserListScreen
    fireEvent.press(screen.getByText('Go to Add User'));

    // Verify that the app has navigated and the AddUserScreen is now visible
    expect(screen.getByText('Add User Screen')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    const tree = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
