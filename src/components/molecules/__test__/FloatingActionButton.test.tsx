import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import FloatingActionButton from '../FloatingActionButton';

describe('FloatingActionButton', () => {
  it('should render the button with a plus icon', () => {
    render(<FloatingActionButton onPress={jest.fn()} />);
    expect(screen.getByText('+')).toBeTruthy();
  });

  it('should call onPress when the button is pressed', () => {
    const onPressMock = jest.fn();
    render(<FloatingActionButton onPress={onPressMock} />);

    const button = screen.getByText('+');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should match the snapshot', () => {
    const tree = render(<FloatingActionButton onPress={jest.fn()} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
