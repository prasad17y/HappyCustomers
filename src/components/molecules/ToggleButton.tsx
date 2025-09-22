import React from 'react';
import {View, StyleSheet, ImageSourcePropType} from 'react-native';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

interface ToggleButtonProps {
  onPress: () => void;
  isActive: boolean;
  source: ImageSourcePropType;
  testID?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onPress,
  isActive,
  source,
  testID = '',
}) => {
  return (
    <Button
      onPress={onPress}
      style={styles.button}
      testID={testID + '-toggle-button'}>
      <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
        <Icon source={source} style={styles.icon} />
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  iconWrapper: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    overflow: 'hidden',
  },
  iconWrapperActive: {
    backgroundColor: '#e3effa',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default React.memo(ToggleButton);
