import {database} from '../db';
import UserModel from '../db/models/UserModel';

export const STALE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours

export const shouldSync = async (
  forceRefresh: boolean,
  lastSyncTimestamp: string | null,
): Promise<boolean> => {
  if (forceRefresh) {
    console.log('Sync forced by user action.');
    return true;
  }

  const userCount = await database.collections
    .get<UserModel>('users')
    .query()
    .fetchCount();
  if (userCount === 0) {
    console.log('Sync required: No local data.');
    return true;
  }

  if (!lastSyncTimestamp) {
    console.log('Sync required: No last sync timestamp found.');
    return true;
  }

  const isStale =
    new Date().getTime() - new Date(lastSyncTimestamp).getTime() >
    STALE_PERIOD_MS;

  if (isStale) {
    console.log('Sync required: Data is stale.');
  } else {
    console.log('Sync not required: Data is fresh.');
  }
  return isStale;
};
