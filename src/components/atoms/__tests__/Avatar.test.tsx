import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('should render the correct initial from a full name', () => {
    render(<Avatar name="John Doe" />);
    // Check that the component correctly displays the first initial
    expect(screen.getByText('J')).toBeTruthy();
  });

  it('should render correctly and match the snapshot', () => {
    const tree = render(<Avatar name="Jane Doe" />);
    // Create a snapshot to lock in the component's structure and style
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should handle an empty name without crashing and match snapshot', () => {
    const tree = render(<Avatar name="" />);
    // Check that an empty name doesn't cause an error and renders consistently
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
