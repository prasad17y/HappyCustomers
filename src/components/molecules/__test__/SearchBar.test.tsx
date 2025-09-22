import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import SearchBar from '../SearchBar';

// Tell Jest to use fake timers (for testing debounce)
jest.useFakeTimers();

describe('SearchBar', () => {
  it('should render correctly and match the snapshot', () => {
    const tree = render(
      <SearchBar
        value=""
        onChangeText={jest.fn()}
        placeholder="Search users"
      />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call onChangeText with the updated text after the debounce delay', () => {
    const onChangeTextMock = jest.fn();
    const debounceDelay = 500;

    render(
      <SearchBar
        value=""
        onChangeText={onChangeTextMock}
        debounceDelay={debounceDelay}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search');

    // Simulate user typing "test"
    fireEvent.changeText(searchInput, 'test');

    // At this point, the callback should NOT have been called yet
    expect(onChangeTextMock).not.toHaveBeenCalled();

    // Fast-forward time by the debounce delay
    jest.advanceTimersByTime(debounceDelay);

    // Now, the callback should have been called with the final text
    expect(onChangeTextMock).toHaveBeenCalledWith('test');
    expect(onChangeTextMock).toHaveBeenCalledTimes(1);
  });

  it('should only call onChangeText once for multiple rapid keystrokes', () => {
    const onChangeTextMock = jest.fn();
    const debounceDelay = 500;

    render(
      <SearchBar
        value=""
        onChangeText={onChangeTextMock}
        debounceDelay={debounceDelay}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search');

    // Simulate rapid typing
    fireEvent.changeText(searchInput, 'a');
    jest.advanceTimersByTime(100); // 100ms
    fireEvent.changeText(searchInput, 'ab');
    jest.advanceTimersByTime(100); // 200ms
    fireEvent.changeText(searchInput, 'abc');
    jest.advanceTimersByTime(100); // 300ms

    // The callback should still not have been called
    expect(onChangeTextMock).not.toHaveBeenCalled();

    // Fast-forward past the debounce timeout
    jest.advanceTimersByTime(debounceDelay);

    // The callback should have been called only once with the final value
    expect(onChangeTextMock).toHaveBeenCalledWith('abc');
    expect(onChangeTextMock).toHaveBeenCalledTimes(1);
  });

  it('should call onDebouncedChange immediately when debounceDelay is 0', () => {
    const onChangeTextMock = jest.fn();
    const debounceDelay = 0;

    render(
      <SearchBar
        value=""
        onChangeText={onChangeTextMock}
        debounceDelay={debounceDelay}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search');

    // Simulate user typing
    fireEvent.changeText(searchInput, 'instant');

    // The callback should be called immediately without advancing timers
    expect(onChangeTextMock).toHaveBeenCalledWith('instant');
    expect(onChangeTextMock).toHaveBeenCalledTimes(1);
  });
});
