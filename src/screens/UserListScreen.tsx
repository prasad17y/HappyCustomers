import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Text,
  SafeAreaView,
} from 'react-native';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {syncUsersRequest, clearSyncError} from '../redux/users/actions';
import {FilterTab, Role} from '../types/types';
import {DirectEventHandler} from 'react-native/Libraries/Types/CodegenTypes';
import {RootStackNavigationProp} from '../navigation/types';
import {Screens} from '../navigation/routes';
import {ToastService} from '../services/ToastService';
import FilterBar from '../components/organisms/FilterBar';
import UserListPage from '../components/organisms/UserListPage';
import FloatingActionButton from '../components/molecules/FloatingActionButton';
import {OnPageSelectedEventData} from 'react-native-pager-view/lib/typescript/PagerViewNativeComponent';
import {selectUsersState, selectDbHasData} from '../redux/users/selectors';

const LAZY_LOAD_PAGES = false; // flicker seen when enabled

const TABS = [
  {key: 'all', title: 'All', role: undefined},
  {key: 'admin', title: 'Admin', role: Role.ADMIN},
  {key: 'manager', title: 'Manager', role: Role.MANAGER},
] as FilterTab[];

const UserListScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const {isSyncing, syncError} = useAppSelector(selectUsersState);
  const dbHasData = useAppSelector(selectDbHasData);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mountedTabs, setMountedTabs] = useState<number[]>([0]);
  const pagerViewRef = useRef<PagerView>(null);
  const scrollPosition = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    dispatch(syncUsersRequest({forceRefresh: false}));
  }, [dispatch]);

  useEffect(() => {
    if (syncError && dbHasData) {
      ToastService.showError('Failed to refresh users.');
      dispatch(clearSyncError());
    }
  }, [syncError, dbHasData, dispatch]);

  // Stop the refresh indicator once the sync is complete
  useEffect(() => {
    if (isRefreshing && !isSyncing) {
      setIsRefreshing(false);
    }
  }, [isSyncing, isRefreshing]);

  const handleTabPress = (_tab: FilterTab, index: number) => {
    pagerViewRef.current?.setPage(index);
  };

  const handlePageScroll = useCallback<
    DirectEventHandler<PagerViewOnPageScrollEventData>
  >(event => {
    const {position, offset} = event.nativeEvent;
    scrollPosition.setValue(position + offset);
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

  const handlePageSelected = useCallback<
    DirectEventHandler<OnPageSelectedEventData>
  >(
    e => {
      const index = e.nativeEvent.position;
      setSelectedIndex(index);
      if (LAZY_LOAD_PAGES && !mountedTabs.includes(index)) {
        setMountedTabs([...mountedTabs, index]);
      }
    },
    [mountedTabs],
  );

  const isInitialLoading = !dbHasData && !syncError;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isInitialLoading ? (
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
          <FilterBar
            tabs={TABS}
            selectedIndex={selectedIndex}
            onTabPress={handleTabPress}
            scrollPosition={scrollPosition}
            onSearchChange={setSearchQuery}
            style={styles.filterTabs}
          />
          <PagerView
            ref={pagerViewRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={handlePageSelected}
            onPageScroll={handlePageScroll}>
            {TABS.map((tab, index) => (
              <View key={tab.key}>
                {!LAZY_LOAD_PAGES || mountedTabs.includes(index) ? (
                  <UserListPage
                    role={tab.role}
                    searchQuery={searchQuery}
                    isRefreshing={isRefreshing}
                    onRefresh={onRefresh}
                    isSelected={selectedIndex === index}
                  />
                ) : null}
              </View>
            ))}
          </PagerView>
          <FloatingActionButton onPress={handleAddUserPress} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterTabs: {
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  pagerView: {
    flex: 1,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserListScreen;
