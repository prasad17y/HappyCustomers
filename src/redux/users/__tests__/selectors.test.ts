import {RootState} from '../../root';
import {selectDbHasData, selectUsersState} from '../selectors';

// Create a mock RootState for our tests
const createMockState = (
  usersState: Partial<RootState['users']>,
): RootState => ({
  users: {
    isSyncing: false,
    isMutating: false,
    syncError: null,
    lastSyncTimestamp: null,
    ...usersState,
  },
  // Add other slices of state here if needed in the future
  notifications: {
    toast: null,
  },
});

describe('users selectors', () => {
  describe('selectUsersState', () => {
    it('should select the users slice from the state', () => {
      const mockState = createMockState({isSyncing: true});
      const selectedState = selectUsersState(mockState);
      expect(selectedState).toEqual(mockState.users);
    });
  });

  describe('selectDbHasData', () => {
    it('should return false when lastSyncTimestamp is null', () => {
      const mockState = createMockState({lastSyncTimestamp: null});
      const hasData = selectDbHasData(mockState);
      expect(hasData).toBe(false);
    });

    it('should return true when lastSyncTimestamp has a value', () => {
      const mockState = createMockState({
        lastSyncTimestamp: new Date().toISOString(),
      });
      const hasData = selectDbHasData(mockState);
      expect(hasData).toBe(true);
    });
  });
});
