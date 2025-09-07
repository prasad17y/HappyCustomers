import React from 'react';
import AddUserScreen, {validationSchema} from '../AddUserScreen';
import {addUser} from '../../db/actions';
import {ToastService} from '../../services/ToastService';
import {render, fireEvent, waitFor} from '@testing-library/react-native';

jest.mock('../../db/actions', () => ({
  addUser: jest.fn(),
}));

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

// Mock ToastService
jest.mock('../../services/ToastService', () => ({
  ToastService: {
    showSuccess: jest.fn(),
    showError: jest.fn(),
  },
}));

describe('AddUserScreen Validation Schema', () => {
  it('should pass validation for correct data', async () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    const isValid = await validationSchema.isValid(validData);
    expect(isValid).toBe(true);
  });

  it('should pass validation for an empty email string', async () => {
    const validData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: '',
    };
    const isValid = await validationSchema.isValid(validData);
    expect(isValid).toBe(true);
  });

  it('should fail validation if first name is missing', async () => {
    const invalidData = {firstName: '', lastName: 'Doe'};
    await expect(
      validationSchema.validate(invalidData, {abortEarly: true}),
    ).rejects.toThrow('First Name is required.');
  });

  it('should fail validation if name contains numbers', async () => {
    const invalidData = {firstName: 'John123', lastName: 'Doe'};
    await expect(validationSchema.validate(invalidData)).rejects.toThrow(
      'Name can only contain letters.',
    );
  });

  it('should fail validation for an invalid email format', async () => {
    const invalidData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@invalid',
    };
    await expect(validationSchema.validate(invalidData)).rejects.toThrow(
      'Please enter a valid email address.',
    );
  });

  it('should fail validation if full name is over 50 characters', async () => {
    const invalidData = {
      firstName: 'ThisIsAVeryLongFirstNameThatWillExceedTheLimit',
      lastName: 'ThisIsAVeryLongLastNameThatWillExceedTheLimit',
    };
    await expect(validationSchema.validate(invalidData)).rejects.toThrow(
      'Full name cannot exceed 50 characters.',
    );
  });
});

describe('AddUserScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {toJSON, getByTestId} = render(<AddUserScreen />);
    fireEvent(getByTestId('add-user-screen-filter-tabs-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with all validation errors visible', async () => {
    const {getByText, toJSON, getByTestId} = render(<AddUserScreen />);
    fireEvent(getByTestId('add-user-screen-filter-tabs-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    fireEvent.press(getByText('Create User'));

    await waitFor(() => {
      expect(getByText('First Name is required.')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('submits valid form and calls addUser & ToastService.showSuccess', async () => {
    (addUser as jest.Mock).mockResolvedValueOnce({});

    const {getByPlaceholderText, getByText} = render(<AddUserScreen />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');

    fireEvent.press(getByText('Create User'));

    await waitFor(() => {
      expect(addUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'MANAGER',
      });
      expect(ToastService.showSuccess).toHaveBeenCalledWith(
        'User created successfully!',
      );
    });
  });

  it('submits valid form and calls addUser & ToastService.showSuccess with role admin', async () => {
    (addUser as jest.Mock).mockResolvedValueOnce({});

    const {getByPlaceholderText, getByText, getByTestId} = render(
      <AddUserScreen />,
    );

    fireEvent(getByTestId('add-user-screen-filter-tabs-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    const tab = getByTestId('add-user-screen-filter-tab-0'); // admin tab

    fireEvent.press(tab);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');

    fireEvent.press(getByText('Create User'));

    await waitFor(() => {
      expect(addUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'ADMIN',
      });
      expect(ToastService.showSuccess).toHaveBeenCalledWith(
        'User created successfully!',
      );
    });
  });

  it('shows error toast if addUser throws', async () => {
    (addUser as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to add user'),
    );

    const {getByPlaceholderText, getByText} = render(<AddUserScreen />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');

    fireEvent.press(getByText('Create User'));

    await waitFor(() => {
      expect(ToastService.showError).toHaveBeenCalledWith(
        'Could not create user.',
      );
    });
  });
});
