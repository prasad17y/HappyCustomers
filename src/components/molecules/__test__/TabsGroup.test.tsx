import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import TabsGroup from '../TabsGroup';
import {Animated} from 'react-native';
import {FilterTab, Role} from '../../../types/types';

describe('TabsGroup', () => {
  const onTabPressMock = jest.fn();

  const TABS = [
    {key: 'all', title: 'All', role: undefined},
    {key: 'admin', title: 'Admin', role: Role.ADMIN},
    {key: 'manager', title: 'Manager', role: Role.MANAGER},
  ] as FilterTab[];

  beforeEach(() => {
    onTabPressMock.mockClear();
  });

  it('should render all tabs correctly and match the snapshot', () => {
    const tree = render(
      <TabsGroup
        tabs={TABS}
        selectedIndex={0}
        onTabPress={onTabPressMock}
        scrollPosition={new Animated.Value(0)}
        testID="testid"
      />,
    );

    fireEvent(tree.getByTestId('testid-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    // Verify all tabs are rendered
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
    expect(screen.getByText('Manager')).toBeTruthy();

    // Lock in the visual structure with a snapshot
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call onTabPress with the correct index when a tab is pressed', () => {
    render(
      <TabsGroup
        tabs={TABS}
        selectedIndex={0}
        onTabPress={onTabPressMock}
        scrollPosition={new Animated.Value(0)}
        testID="testid"
      />,
    );

    fireEvent(screen.getByTestId('testid-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    // Simulate pressing the "Admin" tab, which is at index 1
    fireEvent.press(screen.getByText('Admin'));

    // Verify the callback was called with the correct index
    expect(onTabPressMock).toHaveBeenCalledWith(TABS[1], 1);
    expect(onTabPressMock).toHaveBeenCalledTimes(1);
  });

  it('should apply selected styles to the currently selected tab', () => {
    const tree = render(
      <TabsGroup
        tabs={TABS}
        selectedIndex={1} // "Admin" is selected
        onTabPress={onTabPressMock}
        scrollPosition={new Animated.Value(1)}
        testID="testid"
      />,
    );

    fireEvent(screen.getByTestId('testid-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    // The snapshot will now reflect the styles for the selected state
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
