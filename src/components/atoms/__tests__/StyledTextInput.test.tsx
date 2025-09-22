import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import StyledTextInput from '../StyledTextInput';

describe('StyledTextInput', () => {
  it('should render correctly and match the snapshot', () => {
    const tree = render(
      <StyledTextInput value="Test" placeholder="Enter text" />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should handle text changes', () => {
    const onChangeTextMock = jest.fn();
    render(
      <StyledTextInput
        value=""
        onChangeText={onChangeTextMock}
        placeholder="Enter text"
      />,
    );

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'hello world');
    expect(onChangeTextMock).toHaveBeenCalledWith('hello world');
  });

  it('should apply an error style when hasError is true', () => {
    const tree = render(
      <StyledTextInput value="Test" placeholder="Enter text" hasError />,
    );

    // The snapshot will now include the red border color, locking in the error style
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
