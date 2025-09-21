import {RootState} from '../root';

export const selectUsersState = (state: RootState) => state.users;

// whethr the database has been successfully synced at least once
export const selectDbHasData = (state: RootState) =>
  !!state.users.lastSyncTimestamp;
