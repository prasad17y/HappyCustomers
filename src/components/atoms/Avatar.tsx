import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface AvatarProps {
  name: string;
}

const Avatar: React.FC<AvatarProps> = ({name}) => {
  return (
    <View style={styles.initialsContainer}>
      <Text style={styles.initialsText}>{getInitials(name)}</Text>
    </View>
  );
};

const getInitials = (name: string) => {
  const names = name.split(' ');
  const firstNameInitial = names[0] ? names[0][0] : '';
  return `${firstNameInitial}`.toUpperCase();
};

const styles = StyleSheet.create({
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#e3effa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#0b5ac2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(Avatar);
