import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Role, UserType} from '../../types/types';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import {deleteUserRequest} from '../../redux/users/actions';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '../../navigation/routes';
import {RootStackNavigationProp} from '../../navigation/types';
import {useAppDispatch} from '../../redux/hooks';

interface UserListItemProps {
  user: UserType;
}

const UserListItem: React.FC<UserListItemProps> = ({user}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();

  const handleItemPress = () => {
    navigation.navigate(Screens.EditUser, {userId: user.id});
  };

  const handleDeletePress = () => {
    dispatch(deleteUserRequest({userId: user.id, userName: user.name}));
  };

  return (
    <TouchableOpacity onPress={handleItemPress} style={styles.container}>
      <View style={styles.leftContainer}>
        <Avatar name={user.name} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
        </View>
        {user.role === Role.ADMIN && <Text style={styles.role}>Admin</Text>}
      </View>
      <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
        <Icon source={require('../../assets/trash.png')} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    color: '#191a1a',
  },
  role: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
});

export default React.memo(UserListItem);
