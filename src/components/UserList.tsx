import React, {useMemo, useCallback} from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {UserType} from '../types/types';
import UserListItem from './UserListItem';

interface UserListProps {
  users: UserType[];
  refreshing: boolean;
  onRefresh: () => void;
  emptyMessage?: string;
}

interface Section {
  title: string;
  data: UserType[];
}

const ITEM_HEIGHT = 64;
const SECTION_HEADER_HEIGHT = 34;

const UserList: React.FC<UserListProps> = ({
  users,
  refreshing,
  onRefresh,
  emptyMessage = 'No results found',
}) => {
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

  const getItemLayout = useCallback(
    (
      data: Section[] | null,
      index: number,
    ): {length: number; offset: number; index: number} => {
      if (!data) {
        return {length: 0, offset: 0, index};
      }

      let offset = 0;
      let absoluteIndex = 0;

      for (const section of data) {
        // Check if the target index is the header of the current section
        if (index === absoluteIndex) {
          return {length: SECTION_HEADER_HEIGHT, offset, index};
        }
        offset += SECTION_HEADER_HEIGHT;
        absoluteIndex += 1;

        // Check if the target index is an item within the current section
        if (index < absoluteIndex + section.data.length) {
          const itemIndexInSection = index - absoluteIndex;
          return {
            length: ITEM_HEIGHT,
            offset: offset + itemIndexInSection * ITEM_HEIGHT,
            index,
          };
        }

        // Move to the next section
        offset += section.data.length * ITEM_HEIGHT;
        absoluteIndex += section.data.length;
      }

      return {length: 0, offset, index};
    },
    [],
  );

  return groupedUsers?.length > 0 ? (
    <SectionList
      sections={groupedUsers}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={5}
      getItemLayout={getItemLayout}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  ) : (
    <View style={styles.emptyMessageContainer}>
      <Text style={styles.emptyMessage}>{emptyMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
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
  emptyMessageContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'black',
  },
});

export default React.memo(UserList);
