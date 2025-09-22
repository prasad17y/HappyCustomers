import {shouldSync, STALE_PERIOD_MS} from '../syncUtils';
import {database} from '../../db';

// Mock the database dependency used by the utility
jest.mock('../../db', () => ({
  database: {
    collections: {
      get: jest.fn().mockReturnValue({
        query: jest.fn().mockReturnValue({
          fetchCount: jest.fn(),
        }),
      }),
    },
  },
}));

// A helper to get the mocked fetchCount function
const fetchCountMock = database.collections.get('users').query()
  .fetchCount as jest.Mock;

describe('shouldSync', () => {
  beforeEach(() => {
    // Clear mock history before each test
    fetchCountMock.mockClear();
  });

  it('should return true if forceRefresh is true', async () => {
    const result = await shouldSync(true, new Date().toISOString());
    expect(result).toBe(true);
    // It should not even check the database in this case
    expect(fetchCountMock).not.toHaveBeenCalled();
  });

  it('should return true if there is no local data', async () => {
    fetchCountMock.mockResolvedValue(0);
    const result = await shouldSync(false, new Date().toISOString());
    expect(result).toBe(true);
  });

  it('should return true if there is no lastSyncTimestamp', async () => {
    fetchCountMock.mockResolvedValue(10);
    const result = await shouldSync(false, null);
    expect(result).toBe(true);
  });

  it('should return true if the last sync timestamp is stale', async () => {
    // Create a timestamp from 25 hours ago
    const staleTimestamp = new Date(
      Date.now() - STALE_PERIOD_MS - 1,
    ).toISOString();
    fetchCountMock.mockResolvedValue(10);
    const result = await shouldSync(false, staleTimestamp);
    expect(result).toBe(true);
  });

  it('should return false if the last sync timestamp is fresh', async () => {
    // Create a timestamp from 1 hour ago
    const freshTimestamp = new Date(
      Date.now() - 1 * 60 * 60 * 1000,
    ).toISOString();
    fetchCountMock.mockResolvedValue(10);
    const result = await shouldSync(false, freshTimestamp);
    expect(result).toBe(false);
  });
});
