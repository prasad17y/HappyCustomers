import React from 'react';
import {render} from '@testing-library/react-native';
import Icon from '../Icon';

describe('Icon', () => {
  it('should render correctly and match the snapshot', () => {
    const tree = render(
      <Icon source={require('../../../assets/search.png')} />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
