import {StateObservable} from 'redux-observable';
import {of, Subject} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {usersEpic} from '../epics';
import * as syncUtils from '../../../utils/syncUtils'; // Import the utils
import {
  syncUsersRequest,
  syncUsersSuccess,
  syncUsersFailure,
  setMutating,
} from '../actions';
import {showToast} from '../../notifications/actions';
import * as dbActions from '../../../db/actions';
import {RootState} from '../../root';

// Mock the db/actions module
jest.mock('../../../db/actions');

// Mock our new syncUtils module
jest.mock('../../../utils/syncUtils');
const shouldSyncMock = syncUtils.shouldSync as jest.Mock;

describe('usersEpic (sync)', () => {
  let state$: StateObservable<RootState>;

  const createMockState = (usersState: Partial<RootState['users']>) => {
    const mockState: Partial<RootState> = {
      users: {
        isSyncing: false,
        isMutating: false,
        syncError: null,
        lastSyncTimestamp: null,
        ...usersState,
      } as any,
    };
    return new StateObservable(new Subject(), mockState as RootState);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should perform a sync if shouldSync returns true', done => {
    shouldSyncMock.mockResolvedValue(true);
    (dbActions.syncData as jest.Mock).mockResolvedValue(undefined);
    const action$ = of(syncUsersRequest({forceRefresh: true}));
    state$ = createMockState({isMutating: false});

    const expectedActions = [
      setMutating(true),
      syncUsersSuccess({didFetch: true}),
    ];

    usersEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(dbActions.syncData).toHaveBeenCalledTimes(1);
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should not perform a sync if shouldSync returns false', done => {
    shouldSyncMock.mockResolvedValue(false);

    const action$ = of(syncUsersRequest({forceRefresh: false}));
    state$ = createMockState({isMutating: false});

    const expectedActions = [syncUsersSuccess({didFetch: false})];

    usersEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(dbActions.syncData).not.toHaveBeenCalled();
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should handle a failed sync if shouldSync returns true', done => {
    shouldSyncMock.mockResolvedValue(true);
    (dbActions.syncData as jest.Mock).mockRejectedValue(
      new Error('Network Error'),
    );
    const action$ = of(syncUsersRequest({forceRefresh: true}));
    state$ = createMockState({isMutating: false});

    const expectedActions = [
      setMutating(true),
      syncUsersFailure('Network Error'),
    ];

    usersEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should dispatch a "busy" toast if shouldSync is true but a mutation is in progress', done => {
    shouldSyncMock.mockResolvedValue(true);
    const action$ = of(syncUsersRequest({forceRefresh: true}));
    state$ = createMockState({isMutating: true}); // Set isMutating to true

    const expectedActions = [
      showToast({
        message: 'Operation in progress. Please try again later.',
        type: 'error',
      }),
    ];

    usersEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        // Ensure the database sync was NOT called
        expect(dbActions.syncData).not.toHaveBeenCalled();
        done();
      });
  });
});
