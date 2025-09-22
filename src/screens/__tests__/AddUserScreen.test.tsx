import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import AddUserScreen from '../AddUserScreen';
import {NavigationContainer} from '@react-navigation/native';
import {Role} from '../../types/types';
import {addUserRequest} from '../../redux/users/actions';

// Mock Redux store
const mockStore = configureStore([]);

// Mock React Navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
}));

describe('AddUserScreen Interaction', () => {
  let store;

  beforeEach(() => {
    // Initialize a fresh store for each test
    store = mockStore({
      users: {},
    });
    store.dispatch = jest.fn();
    mockGoBack.mockClear();
  });

  it('should dispatch addUserRequest with the correct payload when the form is submitted', async () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <AddUserScreen />
        </NavigationContainer>
      </Provider>,
    );

    fireEvent(screen.getByTestId('userform-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    // Fill form
    fireEvent.changeText(screen.getByPlaceholderText('First Name'), 'Test');
    fireEvent.changeText(screen.getByPlaceholderText('Last Name'), 'User');
    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'test@example.com',
    );
    // Simulate pressing the "Admin" role button
    fireEvent.press(screen.getByText('Admin'));

    // Simulate pressing the submit button
    fireEvent.press(screen.getByText('Create User'));

    // Wait for the asynchronous form submission to be processed
    await waitFor(() => {
      // Verify that the correct action was dispatched to the Redux store
      expect(store.dispatch).toHaveBeenCalledWith(
        addUserRequest({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: Role.ADMIN,
        }),
      );
    });
  });

  it('should call navigation.goBack when the close button is pressed', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <AddUserScreen />
        </NavigationContainer>
      </Provider>,
    );

    // Find and press the close button
    fireEvent.press(screen.getByText('✕'));

    // Verify that the goBack function was called
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
