import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  label: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  label,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.plus}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
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
