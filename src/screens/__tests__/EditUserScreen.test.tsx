import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {NavigationContainer} from '@react-navigation/native';
import EditUserScreen from '../EditUserScreen';
import {Role} from '../../types/types';
import {updateUserRequest} from '../../redux/users/actions';

// Mock the database's find method
const mockUserFind = jest.fn();
jest.mock('../../db', () => ({
  database: {
    collections: {
      get: () => ({
        find: mockUserFind,
      }),
    },
  },
}));

// Mock Redux store
const mockStore = configureStore([]);

// Mock React Navigation to provide the userId parameter and goBack function
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {
      userId: 'user-123',
    },
  }),
}));

describe('EditUserScreen Interaction', () => {
  let store;
  const mockUser = {
    id: 'user-123',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: Role.ADMIN,
  };

  beforeEach(() => {
    store = mockStore({
      users: {}, // Initial Redux state
    });
    store.dispatch = jest.fn();
    mockUserFind.mockClear();
    mockGoBack.mockClear();
  });

  it('should show a loading indicator while fetching user data', () => {
    mockUserFind.mockReturnValue(new Promise(() => {})); // A promise that never resolves
    render(
      <Provider store={store}>
        <NavigationContainer>
          <EditUserScreen />
        </NavigationContainer>
      </Provider>,
    );
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should populate the form with the fetched user data', async () => {
    mockUserFind.mockResolvedValue(mockUser);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <EditUserScreen />
        </NavigationContainer>
      </Provider>,
    );

    // Wait for the form to be populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('Jane')).toBeTruthy();
      expect(screen.getByDisplayValue('Doe')).toBeTruthy();
      expect(screen.getByDisplayValue('jane.doe@example.com')).toBeTruthy();
    });
  });

  it('should dispatch updateUserRequest with updated data when the form is submitted', async () => {
    mockUserFind.mockResolvedValue(mockUser);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <EditUserScreen />
        </NavigationContainer>
      </Provider>,
    );

    // Wait for the form to populate
    await screen.findByDisplayValue('Jane');

    // Simulate the user changing the last name
    fireEvent.changeText(screen.getByDisplayValue('Doe'), 'Smith');

    // Simulate submitting the form
    fireEvent.press(screen.getByText('Save Changes'));

    // Assert that the correct action was dispatched with the updated data
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateUserRequest({
          userId: 'user-123',
          firstName: 'Jane',
          lastName: 'Smith', // The updated last name
          email: 'jane.doe@example.com',
          role: Role.ADMIN,
        }),
      );
    });
  });

  it('should call navigation.goBack when the close button is pressed', async () => {
    mockUserFind.mockResolvedValue(mockUser);
    render(
      <Provider store={store}>
        <NavigationContainer>
          <EditUserScreen />
        </NavigationContainer>
      </Provider>,
    );

    // Wait for the screen to finish loading before interacting
    await screen.findByText('Edit User');

    // Find and press the close button
    fireEvent.press(screen.getByText('✕'));

    // Verify that the goBack function was called
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
