import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {RootStackNavigationProp} from '../navigation/types';
import {Screens} from '../navigation/routes';

const UserListScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  return (
    <View style={styles.container}>
      <Text>User List Screen</Text>
      <Button title="+" onPress={() => navigation.navigate(Screens.AddUser)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserListScreen;
