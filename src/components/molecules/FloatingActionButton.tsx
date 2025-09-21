import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Button from '../atoms/Button';

interface FloatingActionButtonProps {
  onPress: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  return (
    <Button style={styles.container} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0b5ac2',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  plus: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
  },
});

export default React.memo(FloatingActionButton);
