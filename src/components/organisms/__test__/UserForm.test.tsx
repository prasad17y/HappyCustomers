import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import UserForm, {UserFormValues, validationSchema} from '../UserForm';
import {Role} from '../../../types/types';

describe('UserForm Organism', () => {
  const initialValues: UserFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: Role.MANAGER,
    fullName: '',
  };

  describe('Component Rendering and Interaction', () => {
    it('should render correctly and match the snapshot', () => {
      const tree = render(
        <UserForm
          initialValues={initialValues}
          onSubmit={jest.fn()}
          submitButtonText="Create"
        />,
      );

      fireEvent(tree.getByTestId('userform-tabsgroup-container'), 'layout', {
        nativeEvent: {layout: {width: 200}},
      });

      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should call onSubmit with the correct values for a valid form', async () => {
      const onSubmitMock = jest.fn();
      render(
        <UserForm
          initialValues={initialValues}
          onSubmit={onSubmitMock}
          submitButtonText="Create User"
        />,
      );

      fireEvent(screen.getByTestId('userform-tabsgroup-container'), 'layout', {
        nativeEvent: {layout: {width: 200}},
      });

      // Fill out the form with valid data
      fireEvent.changeText(screen.getByPlaceholderText('First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Last Name'), 'Doe');
      fireEvent.changeText(
        screen.getByPlaceholderText('Email'),
        'john.doe@example.com',
      );
      fireEvent.press(screen.getByText('Admin')); // Change role to Admin

      // Press the submit button
      fireEvent.press(screen.getByText('Create User'));

      // Wait for the asynchronous validation and submission to complete
      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        // Check that the first argument of the first call has the correct values
        expect(onSubmitMock.mock.calls[0][0]).toEqual({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: Role.ADMIN,
          fullName: '',
        });
      });
    });

    it('should show a validation error for an invalid first name', async () => {
      render(
        <UserForm
          initialValues={initialValues}
          onSubmit={jest.fn()}
          submitButtonText="Create"
        />,
      );

      fireEvent(screen.getByTestId('userform-tabsgroup-container'), 'layout', {
        nativeEvent: {layout: {width: 200}},
      });

      const firstNameInput = screen.getByPlaceholderText('First Name');

      // Type an invalid value
      fireEvent.changeText(firstNameInput, 'John123');

      // Trigger the onBlur event to run validation
      fireEvent(firstNameInput, 'blur', {
        nativeEvent: {text: 'John123'},
        persist: () => {},
        target: {},
      });

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('Name can only contain letters.')).toBeTruthy();
      });
    });
  });

  describe('Validation Schema', () => {
    it('should pass validation for correct data', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const isValid = await validationSchema.isValid(validData);
      expect(isValid).toBe(true);
    });

    it('should fail validation if first name is missing', async () => {
      const invalidData = {firstName: '', lastName: 'Doe'};
      await expect(validationSchema.validate(invalidData)).rejects.toThrow(
        'First Name is required.',
      );
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
});
