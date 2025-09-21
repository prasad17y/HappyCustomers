import React, {useMemo, useCallback} from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {Role, UserType} from '../../types/types';
import {useUsers} from '../../hooks/useUsers';
import List from '../molecules/List';
import UserListItem from '../molecules/UserListItem';
import {useIsFocused} from '@react-navigation/native';

interface UserListPageProps {
  role?: Role;
  searchQuery: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  isSelected: boolean;
}

interface Section {
  title: string;
  data: UserType[];
}

const UserListPage: React.FC<UserListPageProps> = ({
  role,
  searchQuery,
  isRefreshing,
  onRefresh,
  isSelected,
}) => {
  const isScreenFocused = useIsFocused();

  const {users, error} = useUsers(
    role,
    searchQuery,
    isScreenFocused && isSelected, // run new query only if this is true
  );

  const groupedUsers = useMemo(() => {
    if (users === undefined) {
      return [];
    }
    return users.reduce<Section[]>((acc, user) => {
      const initial = user.name.charAt(0).toUpperCase();
      const lastSection = acc.length > 0 ? acc[acc.length - 1] : undefined;

      if (lastSection && lastSection.title === initial) {
        lastSection.data.push(user);
      } else {
        acc.push({title: initial, data: [user]});
      }
      return acc;
    }, []);
  }, [users]);

  const keyExtractor = useCallback((item: UserType) => item.id, []);

  const {
    renderItem,
    renderEmptyComponent,
    renderSectionHeader,
    renderFooterComponent,
  } = useMemo(() => {
    return {
      renderItem: ({item}: {item: UserType}) => <UserListItem user={item} />,
      renderEmptyComponent: () => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      ),
      renderSectionHeader: ({section}: {section: Section}) => (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
      ),
      renderFooterComponent: () => <View style={styles.footer} />,
    };
  }, []);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          An error occurred while loading users.
        </Text>
      </View>
    );
  }

  if (users === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <List
      sections={groupedUsers}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooterComponent}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  footer: {
    height: 100,
  },
});

export default React.memo(UserListPage);
