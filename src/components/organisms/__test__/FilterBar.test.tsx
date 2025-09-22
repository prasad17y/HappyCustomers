import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import FilterBar from '../FilterBar';
import {Animated} from 'react-native';
import {FilterTab, Role} from '../../../types/types';

describe('FilterBar', () => {
  const TABS = [
    {key: 'all', title: 'All', role: undefined},
    {key: 'admin', title: 'Admin', role: Role.ADMIN},
    {key: 'manager', title: 'Manager', role: Role.MANAGER},
  ] as FilterTab[];
  const onTabPressMock = jest.fn();
  const onSearchChangeMock = jest.fn();

  beforeEach(() => {
    onTabPressMock.mockClear();
    onSearchChangeMock.mockClear();
  });

  it('should render correctly and match the snapshot by default', () => {
    const tree = render(
      <FilterBar
        tabs={TABS}
        selectedIndex={0}
        onTabPress={onTabPressMock}
        scrollPosition={new Animated.Value(0)}
        onSearchChange={onSearchChangeMock}
        style={{}}
      />,
    );

    fireEvent(tree.getByTestId('filterbar-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    // The SearchBar should not be visible initially
    expect(screen.queryByTestId('filterbar-search-bar')).toBeNull();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should show the SearchBar when the search toggle is pressed', () => {
    render(
      <FilterBar
        tabs={TABS}
        selectedIndex={0}
        onTabPress={onTabPressMock}
        scrollPosition={new Animated.Value(0)}
        onSearchChange={onSearchChangeMock}
        style={{}}
      />,
    );

    fireEvent(screen.getByTestId('filterbar-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    // Find the toggle button (we'll assume it's the only one for simplicity, or we'd add a testID)
    const searchToggleButton = screen.getByTestId('filterbar-toggle-button');
    fireEvent.press(searchToggleButton);

    // The SearchBar should now be visible
    expect(screen.getByTestId('filterbar-search-bar')).toBeTruthy();
  });

  it('should hide the SearchBar and clear the search text when the toggle is pressed again', () => {
    render(
      <FilterBar
        tabs={TABS}
        selectedIndex={0}
        onTabPress={onTabPressMock}
        scrollPosition={new Animated.Value(0)}
        onSearchChange={onSearchChangeMock}
        style={{}}
      />,
    );

    fireEvent(screen.getByTestId('filterbar-tabsgroup-container'), 'layout', {
      nativeEvent: {layout: {width: 200}},
    });

    const searchToggleButton = screen.getByTestId('filterbar-toggle-button');

    // First press: show the search bar
    fireEvent.press(searchToggleButton);
    expect(screen.getByTestId('filterbar-search-bar')).toBeTruthy();

    // Second press: hide the search bar
    fireEvent.press(searchToggleButton);
    expect(screen.queryByTestId('filterbar-search-bar')).toBeNull();

    // Verify that the search text was cleared
    expect(onSearchChangeMock).toHaveBeenCalledWith('');
  });
});
