import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {syncData} from '../db/actions';
import {useUsers} from '../hooks/useUsers';
import UserList from '../components/UserList';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import ToggleButton from '../components/ToggleButton';
import {Role} from '../types/types';
import {DirectEventHandler} from 'react-native/Libraries/Types/CodegenTypes';

const TABS = ['All', 'Admin', 'Manager'];

const UserListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // Debounced search query
  const [searchText, setSearchText] = useState(''); // Live search input
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const pagerViewRef = useRef<PagerView>(null);

  // animation values
  const position = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const scrollPosition = useRef(Animated.add(position, offset)).current;

  // Pass debounced searchQuery to the hooks
  const allUsers = useUsers(undefined, searchQuery);
  const adminUsers = useUsers(Role.ADMIN, searchQuery);
  const managerUsers = useUsers(Role.MANAGER, searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchText);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

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

  const toggleSearch = useCallback(() => {
    setIsSearchVisible(prev => {
      setSearchText('');
      return !prev;
    });
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

  const onRefresh = useCallback(async () => {
    if (isRefreshing) {
      return;
    }
    setIsRefreshing(true);
    try {
      await syncData();
    } catch (error) {
      console.error('Pull to refresh failed:', error);
      Alert.alert('Error', 'Failed to refresh users.');
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  return isLoading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.filterBar}>
          <FilterTabs
            tabs={TABS}
            selectedIndex={selectedIndex}
            onTabPress={handleTabPress}
            scrollPosition={scrollPosition}
            style={styles.filterTabs}
          />
          <ToggleButton
            onPress={toggleSearch}
            isActive={isSearchVisible}
            iconUri="https://img.icons8.com/ios-glyphs/30/0b5ac2/search--v1.png"
          />
        </View>
        {isSearchVisible && (
          <SearchBar value={searchText} onChangeText={setSearchText} />
        )}
      </View>
      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => setSelectedIndex(e.nativeEvent.position)}
        onPageScroll={handlePageScroll}>
        <View key="1">
          <UserList
            users={allUsers}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </View>
        <View key="2">
          <UserList
            users={adminUsers}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </View>
        <View key="3">
          <UserList
            users={managerUsers}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
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
  headerContainer: {
    paddingHorizontal: 16,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    marginVertical: 8,
    height: 44,
  },
  filterTabs: {
    flex: 1,
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
