import {validationSchema} from '../AddUserScreen';

jest.mock('../../db/actions', () => ({
  addUser: jest.fn(),
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
