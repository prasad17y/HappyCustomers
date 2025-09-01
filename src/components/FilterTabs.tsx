import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

interface FilterTabsProps {
  tabs: string[];
  selectedIndex: number;
  onTabPress: (index: number) => void;
  scrollPosition: Animated.Value | Animated.AnimatedAddition<string | number>;
}

const CONTAINER_WRAPPER_MARGIN_HORIZONTAL = 16;
const CONTAINER_WRAPPER_PADDING = 4;

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  selectedIndex,
  onTabPress,
  scrollPosition,
}) => {
  const TAB_WIDTH =
    (width -
      CONTAINER_WRAPPER_MARGIN_HORIZONTAL * 2 -
      CONTAINER_WRAPPER_PADDING * 2) /
    tabs.length;

  const translateX = useRef(
    scrollPosition.interpolate({
      inputRange: tabs.map((_, i) => i),
      outputRange: tabs.map((_, i) => TAB_WIDTH * i),
    }),
  ).current;

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.highlight,
            {width: TAB_WIDTH, transform: [{translateX}]},
          ]}
        />
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, {width: TAB_WIDTH}]}
            onPress={() => onTabPress(index)}>
            <Text
              style={[
                styles.tabText,
                selectedIndex === index && styles.selectedTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: '#f0f2f5',
    borderRadius: 22,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 44,
    padding: 4,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#e3effa',
    borderColor: '#0b5ac1',
    borderWidth: 1,
    borderRadius: 18,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#0b5ac2',
    fontWeight: 'bold',
  },
});

export default FilterTabs;
