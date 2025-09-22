import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import FormTextInput from '../FormTextInput';

describe('FormTextInput', () => {
  it('should render the text input correctly', () => {
    render(<FormTextInput value="test" onChangeText={jest.fn()} />);
    expect(screen.getByDisplayValue('test')).toBeTruthy();
  });

  it('should not display an error message if not touched', () => {
    render(
      <FormTextInput
        value=""
        onChangeText={jest.fn()}
        error="This is an error"
        touched={false}
      />,
    );
    expect(screen.queryByText('This is an error')).toBeNull();
  });

  it('should display an error message when touched and an error exists', () => {
    render(
      <FormTextInput
        value=""
        onChangeText={jest.fn()}
        error="This is an error"
        touched={true}
      />,
    );
    expect(screen.getByText('This is an error')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    const tree = render(
      <FormTextInput value="snapshot" onChangeText={jest.fn()} />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
