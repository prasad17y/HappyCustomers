import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  label,
  style,
}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.plus}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#0b5ac2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
  },
});

export default React.memo(FloatingActionButton);
