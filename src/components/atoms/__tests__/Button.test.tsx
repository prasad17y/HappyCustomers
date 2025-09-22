import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import Button from '../Button';
import {Text} from 'react-native';

describe('Button', () => {
  it('should render children correctly', () => {
    render(
      <Button>
        <Text>Click Me</Text>
      </Button>,
    );
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('should handle onPress events', () => {
    const onPressMock = jest.fn();
    render(
      <Button onPress={onPressMock}>
        <Text>Click Me</Text>
      </Button>,
    );

    fireEvent.press(screen.getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should match the snapshot', () => {
    const tree = render(
      <Button>
        <Text>Snapshot Button</Text>
      </Button>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
