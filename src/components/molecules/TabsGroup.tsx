import React, {useMemo, useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Tab} from '../../types/types';

interface TabsGroupProps<T extends Tab> {
  tabs: T[];
  selectedIndex: number;
  onTabPress: (tab: T, index: number) => void;
  scrollPosition?: Animated.Value | Animated.AnimatedAddition<string | number>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const CONTAINER_PADDING = 4;

const TabsGroup = <T extends Tab>({
  tabs,
  selectedIndex,
  onTabPress,
  scrollPosition,
  style,
  testID,
}: TabsGroupProps<T>) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const internalAnimatedValue = useRef(
    new Animated.Value(selectedIndex),
  ).current;

  // use scrollPosition if it exists otherwise use internalAnimatedValue
  const position = scrollPosition || internalAnimatedValue;

  useEffect(() => {
    if (!scrollPosition) {
      Animated.timing(internalAnimatedValue, {
        toValue: selectedIndex,
        useNativeDriver: true,
        duration: 300,
      }).start();
    }
  }, [selectedIndex, scrollPosition, internalAnimatedValue]);

  const {tabWidth, translateX} = useMemo(() => {
    const calculatedTabWidth =
      containerWidth > 0
        ? (containerWidth - CONTAINER_PADDING * 2) / tabs.length
        : 0;
    const interpolatedTranslateX = position.interpolate({
      inputRange: tabs.map((_, i) => i),
      outputRange: tabs.map((_, i) => calculatedTabWidth * i),
    });
    return {tabWidth: calculatedTabWidth, translateX: interpolatedTranslateX};
  }, [position, tabs, containerWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View
      style={[styles.containerWrapper, style]}
      testID={testID + '-tabsgroup-container'}
      onLayout={onLayout}>
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
              key={tab.key}
              testID={testID + '-tabsgroup-' + index}
              style={[styles.tab, {width: tabWidth}]}
              onPress={() => onTabPress(tab, index)}>
              <Text
                style={[
                  styles.tabText,
                  selectedIndex === index && styles.selectedTabText,
                ]}>
                {tab.title}
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
    fontWeight: '500',
  },
});

export default React.memo(TabsGroup);
