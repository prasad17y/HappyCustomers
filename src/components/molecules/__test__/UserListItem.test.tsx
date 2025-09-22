import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import UserListItem from '../UserListItem';
import {Role, UserType} from '../../../types/types';
import {deleteUserRequest} from '../../../redux/users/actions';

// Mock Redux's useDispatch hook
const mockDispatch = jest.fn();
jest.mock('../../../redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

// Mock React Navigation's useNavigation hook
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('UserListItem', () => {
  const mockUser: UserType = {
    id: '123',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: Role.ADMIN,
  };

  beforeEach(() => {
    // Clear mock history before each test
    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  it('should render user information correctly', () => {
    render(<UserListItem user={mockUser} />);
    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('should navigate to EditUser screen on press', () => {
    render(<UserListItem user={mockUser} />);

    fireEvent.press(screen.getByText('Jane Doe'));

    expect(mockNavigate).toHaveBeenCalledWith('EditUser', {userId: '123'});
  });

  it('should dispatch deleteUserRequest when the delete button is pressed', () => {
    render(<UserListItem user={mockUser} />);

    // Find the delete button by its testID and press it
    const deleteButton = screen.getByTestId('userlistitem-delete-button');
    fireEvent.press(deleteButton);

    // Verify that the correct Redux action was dispatched with the correct payload
    expect(mockDispatch).toHaveBeenCalledWith(
      deleteUserRequest({userId: '123', userName: 'Jane Doe'}),
    );
  });

  // snapshot test
  it('should match the snapshot', () => {
    const tree = render(<UserListItem user={mockUser} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
