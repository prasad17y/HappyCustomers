import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import List from '../List';
import {Text, View} from 'react-native';

const mockSections = [
  {
    title: 'A',
    data: [
      {id: '1', name: 'Alice'},
      {id: '2', name: 'Alicia'},
    ],
  },
  {
    title: 'B',
    data: [{id: '3', name: 'Bob'}],
  },
];

// Mock render components
const renderItem = ({item}: {item: {id: string; name: string}}) => (
  <View>
    <Text>{item.name}</Text>
  </View>
);

const renderSectionHeader = ({section}: {section: any}) => (
  <View>
    <Text>{section.title}</Text>
  </View>
);

const keyExtractor = (item: {id: string}) => item.id;

describe('List', () => {
  it('should render sections and items correctly', () => {
    render(
      <List
        sections={mockSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshing={false}
        onRefresh={jest.fn()}
        keyExtractor={keyExtractor}
      />,
    );

    // Check for section headers
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();

    // Check for list items
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Alicia')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('should render the ListEmptyComponent when sections are empty', () => {
    const EmptyComponent = () => <Text>The list is empty.</Text>;
    render(
      <List
        sections={[]}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshing={false}
        onRefresh={jest.fn()}
        keyExtractor={keyExtractor}
        ListEmptyComponent={EmptyComponent}
      />,
    );

    expect(screen.getByText('The list is empty.')).toBeTruthy();
  });

  it('should render the ListFooterComponent', () => {
    const FooterComponent = () => <Text>End of list.</Text>;
    render(
      <List
        sections={mockSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshing={false}
        onRefresh={jest.fn()}
        keyExtractor={keyExtractor}
        ListFooterComponent={FooterComponent}
      />,
    );

    expect(screen.getByText('End of list.')).toBeTruthy();
  });

  it('should call onRefresh when a pull-to-refresh is simulated', () => {
    const onRefreshMock = jest.fn();
    render(
      <List
        sections={mockSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshing={false}
        onRefresh={onRefreshMock}
        keyExtractor={keyExtractor}
      />,
    );

    fireEvent(screen.getByTestId('sectionlist'), 'refresh');

    expect(onRefreshMock).toHaveBeenCalledTimes(1);
  });

  it('should match the snapshot', () => {
    const tree = render(
      <List
        sections={mockSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        refreshing={false}
        onRefresh={jest.fn()}
        keyExtractor={keyExtractor}
      />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('List getItemLayout', () => {
  const ITEM_HEIGHT = 64;
  const SECTION_HEADER_HEIGHT = 34;

  const {getByTestId} = render(
    <List
      sections={mockSections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshing={false}
      onRefresh={jest.fn()}
      keyExtractor={keyExtractor}
    />,
  );

  // The underlying SectionList is given a testID by default in RNTL, but we can find it by role
  const sectionListInstance = getByTestId('sectionlist');
  const getItemLayout = sectionListInstance.props.getItemLayout;

  it('should calculate the layout for the first section header (index 0)', () => {
    const layout = getItemLayout(mockSections, 0);
    expect(layout.offset).toBe(0);
    expect(layout.length).toBe(SECTION_HEADER_HEIGHT);
  });

  it('should calculate the layout for the first item in the first section (index 1)', () => {
    const layout = getItemLayout(mockSections, 1);
    expect(layout.offset).toBe(SECTION_HEADER_HEIGHT);
    expect(layout.length).toBe(ITEM_HEIGHT);
  });

  it('should calculate the layout for the second item in the first section (index 2)', () => {
    const layout = getItemLayout(mockSections, 2);
    const expectedOffset = SECTION_HEADER_HEIGHT + ITEM_HEIGHT; // 34 + 64 = 98
    expect(layout.offset).toBe(expectedOffset);
    expect(layout.length).toBe(ITEM_HEIGHT);
  });

  it('should calculate the layout for the second section header (index 3)', () => {
    const layout = getItemLayout(mockSections, 3);
    const expectedOffset =
      SECTION_HEADER_HEIGHT + mockSections[0].data.length * ITEM_HEIGHT; // 34 + 2 * 64 = 162
    expect(layout.offset).toBe(expectedOffset);
    expect(layout.length).toBe(SECTION_HEADER_HEIGHT);
  });

  it('should calculate the layout for the first item in the second section (index 4)', () => {
    const layout = getItemLayout(mockSections, 4);
    const expectedOffset =
      SECTION_HEADER_HEIGHT + // Header A
      mockSections[0].data.length * ITEM_HEIGHT + // Items in A
      SECTION_HEADER_HEIGHT; // Header B
    // 34 + 2 * 64 + 34 = 196
    expect(layout.offset).toBe(expectedOffset);
    expect(layout.length).toBe(ITEM_HEIGHT);
  });
});
