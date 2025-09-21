import React, {useMemo, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {UserType} from '../../types/types';
import List from '../molecules/List';
import UserListItem from '../molecules/UserListItem';

interface UserListProps {
  users: UserType[];
  refreshing: boolean;
  onRefresh: () => void;
}

interface Section {
  title: string;
  data: UserType[];
}

const UserList: React.FC<UserListProps> = ({users, refreshing, onRefresh}) => {
  const groupedUsers = useMemo(() => {
    return users.reduce<Section[]>((acc, user) => {
      const initial = user.name.charAt(0).toUpperCase();
      const lastSection = acc[acc.length - 1];

      if (lastSection && lastSection.title === initial) {
        lastSection.data.push(user);
      } else {
        acc.push({title: initial, data: [user]});
      }
      return acc;
    }, []);
  }, [users]);

  const renderItem = useCallback(
    ({item}: {item: UserType}) => <UserListItem user={item} />,
    [],
  );

  const renderSectionHeader = useCallback(
    ({section}: {section: Section}) => (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: UserType) => item.id, []);

  return (
    <List
      sections={groupedUsers}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyExtractor={keyExtractor}
    />
  );
};

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3c4040',
  },
});

export default React.memo(UserList);
