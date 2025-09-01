import React, {useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import {Screens} from '../navigation/routes';
import {syncData} from '../db/actions';
import {useUsers} from '../hooks/useUsers';
import UserList from '../components/UserList';
import {UserType} from '../types';

const UserListScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const users = useUsers(); // This hook now returns UserType[]
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initialSync = async () => {
      try {
        await syncData();
      } catch (error) {
        console.error('Initial sync failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialSync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Pass the plain users directly to the list */}
      <UserList users={users} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserListScreen;
