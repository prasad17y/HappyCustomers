import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Animated, StyleProp, ViewStyle} from 'react-native';
import TabsGroup from '../molecules/TabsGroup';
import ToggleButton from '../molecules/ToggleButton';
import SearchBar from '../molecules/SearchBar';
import {FilterTab} from '../../types/types';

interface FilterBarProps {
  tabs: FilterTab[];
  selectedIndex: number;
  onTabPress: (tab: FilterTab, index: number) => void;
  scrollPosition: Animated.Value | Animated.AnimatedAddition<string | number>;
  searchText?: string;
  onSearchChange: (query: string) => void;
  style?: StyleProp<ViewStyle>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  tabs,
  selectedIndex,
  onTabPress,
  scrollPosition,
  searchText,
  onSearchChange,
  style,
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = useCallback(() => {
    setIsSearchVisible(prev => {
      // clear the search text when hiding the search bar
      if (prev) {
        onSearchChange('');
      }
      return !prev;
    });
  }, [onSearchChange]);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <TabsGroup
          tabs={tabs}
          selectedIndex={selectedIndex}
          onTabPress={onTabPress}
          scrollPosition={scrollPosition}
          style={styles.tabsGroup}
          testID="filterbar"
        />
        <ToggleButton
          onPress={toggleSearch}
          isActive={isSearchVisible}
          source={require('../../assets/search.png')}
          testID="filterbar"
        />
      </View>
      {isSearchVisible && (
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchText ?? ''}
            onChangeText={onSearchChange}
            debounceDelay={300}
            testID="filterbar"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
  },
  tabsGroup: {
    flex: 1,
  },
  searchBarContainer: {
    marginTop: 8,
  },
});

export default React.memo(FilterBar);
