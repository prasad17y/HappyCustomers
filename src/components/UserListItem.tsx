import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {UserType} from '../types';

interface UserListItemProps {
  user: UserType;
}

const UserListItem: React.FC<UserListItemProps> = ({user}) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const firstNameInitial = names[0] ? names[0][0] : '';
    return `${firstNameInitial}`.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.initialsContainer}>
        <Text style={styles.initialsText}>{getInitials(user.name)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
      </View>
      {user.role === 'ADMIN' && <Text style={styles.role}>{user.role}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#e3effa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialsText: {
    color: '#0b5ac2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#191a1a',
  },
  role: {
    fontSize: 14,
    color: '#888',
  },
});

export default React.memo(UserListItem);
