import {syncData, addUser, updateUser, deleteUser} from '../actions';
import {database} from '..';
import client from '../../apollo/client';
import {Role} from '../../types/types';

// --- Mocks Setup ---

// Mock the Apollo Client
jest.mock('../../apollo/client', () => ({
  query: jest.fn(),
}));

// Mock AsyncStorage (though not used in actions, it's good practice for other tests)
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock the entire WatermelonDB database instance
const mockPrepareCreate = jest.fn();
const mockPrepareUpdate = jest.fn();
const mockUpdate = jest.fn();
const mockDestroyPermanently = jest.fn();
const mockFind = jest.fn();
const mockFetch = jest.fn();

const mockUserCollection = {
  find: mockFind,
  create: jest.fn(),
  prepareCreate: mockPrepareCreate,
  query: () => ({
    fetch: mockFetch,
  }),
};

jest.mock('..', () => ({
  database: {
    write: jest.fn(async writer => await writer()),
    batch: jest.fn(),
    collections: {
      get: jest.fn(),
    },
  },
}));

// --- Tests ---

describe('Database Actions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Re-establish the mock for the collection after clearing
    (database.collections.get as jest.Mock).mockReturnValue(mockUserCollection);
  });

  describe('syncData', () => {
    const mockApiResponse = {
      data: {
        listZellerCustomers: {
          items: [
            {
              id: '1',
              name: 'John Doe',
              role: Role.ADMIN,
              email: 'john@test.com',
            },
          ],
        },
      },
    };

    it('should create new users if local DB is empty', async () => {
      (client.query as jest.Mock).mockResolvedValue(mockApiResponse);

      // Mock that the local database is empty
      mockFetch.mockResolvedValue([]);

      await syncData();

      // Verify a new user create operation was prepared
      expect(mockPrepareCreate).toHaveBeenCalledTimes(1);
      expect(mockPrepareUpdate).not.toHaveBeenCalled();
      expect(database.batch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the API call fails', async () => {
      (client.query as jest.Mock).mockRejectedValue(new Error('API Error'));
      await expect(syncData()).rejects.toThrow('API Error');
    });
  });

  describe('addUser', () => {
    it('should create a new user with correct data', async () => {
      await addUser({
        firstName: 'Jane',
        lastName: 'Doe',
        role: Role.MANAGER,
        email: null,
      });

      expect(database.write).toHaveBeenCalledTimes(1);
      const writer = (mockUserCollection.create as jest.Mock).mock.calls[0][0];
      const mockUser = {} as any;
      writer(mockUser);

      expect(mockUser).toEqual({
        name: 'Jane Doe',
        sortableName: 'jane doe',
        role: Role.MANAGER,
        email: null,
      });
    });

    it('should throw an error if user creation fails', async () => {
      (mockUserCollection.create as jest.Mock).mockRejectedValue(
        new Error('DB write failed'),
      );
      await expect(
        addUser({
          firstName: 'fail',
          lastName: 'test',
          role: Role.ADMIN,
          email: null,
        }),
      ).rejects.toThrow('DB write failed');
    });
  });

  describe('updateUser', () => {
    it('should find and update a user', async () => {
      // Mock the find method to return a user with an update method
      mockFind.mockResolvedValue({update: mockUpdate});

      await updateUser({
        userId: '123',
        firstName: 'John',
        lastName: 'Smith',
        role: Role.ADMIN,
        email: 'john.s@test.com',
      });

      expect(mockFind).toHaveBeenCalledWith('123');

      // Check the writer function to verify the updated data
      const writer = (mockUpdate as jest.Mock).mock.calls[0][0];
      const mockUser = {} as any;
      writer(mockUser);

      expect(mockUser).toEqual({
        name: 'John Smith',
        sortableName: 'john smith',
        role: Role.ADMIN,
        email: 'john.s@test.com',
      });
    });

    it('should throw an error if the user to update is not found', async () => {
      mockFind.mockRejectedValue(new Error('User not found'));
      await expect(
        updateUser({
          userId: '404',
          firstName: 'fail',
          lastName: 'test',
          role: Role.ADMIN,
          email: null,
        }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should find and permanently destroy a user', async () => {
      // Mock the find method to return a user with a destroy method
      mockFind.mockResolvedValue({destroyPermanently: mockDestroyPermanently});

      await deleteUser('123');

      expect(mockFind).toHaveBeenCalledWith('123');
      expect(mockDestroyPermanently).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the user to delete is not found', async () => {
      mockFind.mockRejectedValue(new Error('User not found'));
      await expect(deleteUser('404')).rejects.toThrow('User not found');
    });
  });
});
