import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface FilterTabsProps {
  tabs: string[];
  selectedIndex: number;
  onTabPress: (index: number) => void;
  scrollPosition: Animated.Value | Animated.AnimatedAddition<string | number>;
  style?: StyleProp<ViewStyle>;
}

const CONTAINER_PADDING = 4;

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  selectedIndex,
  onTabPress,
  scrollPosition,
  style,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const {tabWidth, translateX} = useMemo(() => {
    const tabWidthVar =
      containerWidth > 0
        ? (containerWidth - CONTAINER_PADDING * 2) / tabs.length
        : 0;

    const translateXVar = scrollPosition.interpolate({
      inputRange: tabs.map((_, i) => i),
      outputRange: tabs.map((_, i) => tabWidthVar * i),
    });

    return {tabWidth: tabWidthVar, translateX: translateXVar};
  }, [scrollPosition, tabs, containerWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={[styles.containerWrapper, style]} onLayout={onLayout}>
      {containerWidth > 0 && (
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.highlight,
              {width: tabWidth, transform: [{translateX}]},
            ]}
          />
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, {width: tabWidth}]}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    backgroundColor: '#f0f2f5',
    borderRadius: 22,
    height: 44,
    padding: CONTAINER_PADDING,
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

export default React.memo(FilterTabs);
