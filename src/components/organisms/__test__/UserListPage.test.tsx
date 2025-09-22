import React from 'react';
import {render, screen} from '@testing-library/react-native';
import UserListPage from '../UserListPage';
import * as useUsersHook from '../../../hooks/useUsers';
import {Role} from '../../../types/types';
import {useIsFocused} from '@react-navigation/native';

// Mock the useIsFocused hook from react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(),
}));

// Mock the entire useUsers hook
jest.mock('../../../hooks/useUsers');
const useUsersMock = useUsersHook.useUsers as jest.Mock;

// Mock the List molecule to simplify the test and check the props it receives
jest.mock('../../molecules/List', () => {
  const React = require('react');
  const {View, Text} = require('react-native');
  return (props: {sections: any[]; refreshing: boolean}) => (
    <View testID="mock-list">
      <Text>{`Sections: ${props.sections.length}`}</Text>
      <Text>{`Refreshing: ${props.refreshing}`}</Text>
    </View>
  );
});

describe('UserListPage', () => {
  const defaultProps = {
    searchQuery: '',
    isRefreshing: false,
    onRefresh: jest.fn(),
    isSelected: true,
  };

  beforeEach(() => {
    // Reset mocks before each test
    useUsersMock.mockClear();
    // Provide a default mock return value for useIsFocused for all tests
    (useIsFocused as jest.Mock).mockReturnValue(true);
  });

  it('should render the ActivityIndicator while the user list is loading', () => {
    // Arrange: Mock the hook to return the "loading" state (undefined)
    useUsersMock.mockReturnValue({users: undefined, error: null});

    render(<UserListPage {...defaultProps} />);

    // Assert: Check that the ActivityIndicator is visible
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    expect(screen.queryByTestId('mock-list')).toBeNull();
  });

  it('should render an error message if the hook returns an error', () => {
    // Arrange: Mock the hook to return an error
    useUsersMock.mockReturnValue({
      users: undefined,
      error: new Error('DB Error'),
    });

    render(<UserListPage {...defaultProps} />);

    // Assert: Check that the error message is displayed
    expect(
      screen.getByText('An error occurred while loading users.'),
    ).toBeTruthy();
  });

  it('should render the list and correctly group users on success', () => {
    // Arrange: Mock the hook to return a list of users
    const mockUsers = [
      {id: '1', name: 'Alice', role: Role.ADMIN},
      {id: '2', name: 'Adam', role: Role.MANAGER},
      {id: '3', name: 'Bob', role: Role.ADMIN},
    ];
    useUsersMock.mockReturnValue({users: mockUsers, error: null});

    render(<UserListPage {...defaultProps} />);

    // Assert: Check that the mock list is rendered and received the correct number of sections
    const list = screen.getByTestId('mock-list');
    expect(list).toBeTruthy();
    // The component should group "Alice" and "Adam" into one section ('A') and "Bob" into another ('B')
    expect(screen.getByText('Sections: 2')).toBeTruthy();
  });

  it('should pass the correct refreshing prop to the List component', () => {
    // Arrange: Mock a successful data return
    useUsersMock.mockReturnValue({users: [], error: null});

    // Render with refreshing set to true
    render(<UserListPage {...defaultProps} isRefreshing={true} />);

    // Assert: Check that the refreshing state is correctly passed down
    expect(screen.getByText('Refreshing: true')).toBeTruthy();
  });

  it('should match the snapshot for a successful render', () => {
    // Arrange: Mock a successful data return
    const mockUsers = [{id: '1', name: 'Charlie', role: Role.MANAGER}];
    useUsersMock.mockReturnValue({users: mockUsers, error: null});

    const tree = render(<UserListPage {...defaultProps} />);

    // Assert: The rendered structure should match the saved snapshot
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
