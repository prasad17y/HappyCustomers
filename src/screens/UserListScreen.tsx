import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Text,
} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/root';
import {clearSyncError, syncUsersRequest} from '../redux/users/actions';
import {useUsers} from '../hooks/useUsers';
import UserList from '../components/UserList';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import ToggleButton from '../components/ToggleButton';
import {Role} from '../types/types';
import {DirectEventHandler} from 'react-native/Libraries/Types/CodegenTypes';
import FloatingActionButton from '../components/FloatingActionButton';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp} from '../navigation/types';
import {Screens} from '../navigation/routes';
import {ToastService} from '../services/ToastService';

const TABS = ['All', 'Admin', 'Manager'];

// Helper component to render each page
const UserListPage = ({
  role,
  searchQuery,
  isRefreshing,
  onRefresh,
}: {
  role?: Role;
  searchQuery: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}) => {
  const users = useUsers(role, searchQuery);

  return users === undefined ? (
    <View style={styles.centered}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <UserList users={users} refreshing={isRefreshing} onRefresh={onRefresh} />
  );
};

const UserListScreen = () => {
  const dispatch = useDispatch();
  const {isSyncing, syncError, lastSyncTimestamp} = useSelector(
    (state: RootState) => state.users,
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // to show pull-to-refresh UI
  const pagerViewRef = useRef<PagerView>(null);
  const navigation = useNavigation<RootStackNavigationProp>();

  // animation values
  const position = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(0)).current;
  const scrollPosition = useRef(Animated.add(position, offset)).current;

  useEffect(() => {
    dispatch(syncUsersRequest({forceRefresh: false}));
  }, [dispatch]);

  useEffect(() => {
    const dbHasData = !!lastSyncTimestamp;
    if (syncError && dbHasData) {
      ToastService.showError(syncError);
      dispatch(clearSyncError());
    }
  }, [syncError, lastSyncTimestamp, dispatch]);

  // Stop the refresh indicator once the sync is complete
  useEffect(() => {
    if (isRefreshing && !isSyncing) {
      setIsRefreshing(false);
    }
  }, [isSyncing, isRefreshing]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toggleSearch = useCallback(() => {
    setIsSearchVisible(prev => {
      if (prev) {
        setSearchQuery('');
      }
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

  const onRefresh = useCallback(() => {
    if (isSyncing) {
      return;
    }
    setIsRefreshing(true);
    dispatch(syncUsersRequest({forceRefresh: true})); // Force refresh on pull
  }, [dispatch, isSyncing]);

  const handleAddUserPress = () => {
    navigation.navigate(Screens.AddUser);
  };

  const dbHasData = !!lastSyncTimestamp;
  const isInitialLoading = !dbHasData && !syncError;

  return isInitialLoading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : syncError && !dbHasData ? (
    <View style={styles.centered}>
      <Text style={styles.errorText}>
        Failed to load users. Please try again.
      </Text>
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
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        )}
      </View>
      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => setSelectedIndex(e.nativeEvent.position)}
        onPageScroll={handlePageScroll}>
        <View key="1">
          <UserListPage
            searchQuery={debouncedSearchQuery}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </View>
        <View key="2">
          <UserListPage
            role={Role.ADMIN}
            searchQuery={debouncedSearchQuery}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </View>
        <View key="3">
          <UserListPage
            role={Role.MANAGER}
            searchQuery={debouncedSearchQuery}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        </View>
      </PagerView>
      <FloatingActionButton onPress={handleAddUserPress} label="+" />
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
    padding: 20,
  },
  pagerView: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserListScreen;
