import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

interface ToggleButtonProps {
  onPress: () => void;
  isActive: boolean;
  source: ImageSourcePropType;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onPress,
  isActive,
  source,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
        <Image source={source} style={styles.icon} />
      </View>
    </TouchableOpacity>
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
