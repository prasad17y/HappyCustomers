import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator, Animated} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {syncData} from '../db/actions';
import {useUsers} from '../hooks/useUsers';
import UserList from '../components/UserList';
import FilterTabs from '../components/FilterTabs';
import {Role} from '../types/types';
import {DirectEventHandler} from 'react-native/Libraries/Types/CodegenTypes';

const TABS = ['All', 'Admin', 'Manager'];

const UserListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);

  // animation values
  const position = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const scrollPosition = useRef(Animated.add(position, offset)).current;

  // Fetch users for each tab
  const allUsers = useUsers();
  const adminUsers = useUsers(Role.ADMIN);
  const managerUsers = useUsers(Role.MANAGER);

  // Sync data on initial component mount
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

  const handleTabPress = (index: number) => {
    pagerViewRef.current?.setPage(index);
  };

  const handlePageScroll = useCallback<
    DirectEventHandler<PagerViewOnPageScrollEventData>
  >(event => {
    position.setValue(event.nativeEvent.position);
    offset.setValue(event.nativeEvent.offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={styles.container}>
      <FilterTabs
        tabs={TABS}
        selectedIndex={selectedIndex}
        onTabPress={handleTabPress}
        scrollPosition={scrollPosition}
      />
      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => setSelectedIndex(e.nativeEvent.position)}
        onPageScroll={handlePageScroll}>
        <View key="1">
          <UserList users={allUsers} />
        </View>
        <View key="2">
          <UserList users={adminUsers} />
        </View>
        <View key="3">
          <UserList users={managerUsers} />
        </View>
      </PagerView>
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
  pagerView: {
    flex: 1,
  },
});

export default UserListScreen;
