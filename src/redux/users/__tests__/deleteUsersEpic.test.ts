import {StateObservable} from 'redux-observable';
import {of, Subject} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {deleteUserEpic} from '../epics';
import {
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
  setMutating,
} from '../actions';
import {showToast} from '../../notifications/actions';
import * as dbActions from '../../../db/actions';
import {RootState} from '../../root';

// Mock the db/actions module
jest.mock('../../../db/actions');

describe('deleteUserEpic', () => {
  let state$: StateObservable<RootState>;

  const createMockState = (isMutating: boolean) => {
    const mockState: Partial<RootState> = {
      users: {isMutating} as any,
    };
    return new StateObservable(new Subject(), mockState as RootState);
  };

  beforeEach(() => {
    (dbActions.deleteUser as jest.Mock).mockClear();
  });

  it('should dispatch setMutating, SUCCESS, and a success toast on successful deletion', done => {
    (dbActions.deleteUser as jest.Mock).mockResolvedValue(undefined);
    const action$ = of(deleteUserRequest({userId: '1', userName: 'Test'}));
    state$ = createMockState(false);

    const expectedActions = [
      setMutating(true),
      deleteUserSuccess(),
      showToast({message: 'User "Test" deleted.', type: 'success'}),
    ];

    deleteUserEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should dispatch FAILURE and an error toast if deletion fails', done => {
    (dbActions.deleteUser as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );
    const action$ = of(deleteUserRequest({userId: '1', userName: 'Test'}));
    state$ = createMockState(false);

    const expectedActions = [
      setMutating(true),
      deleteUserFailure(),
      showToast({message: 'Failed to delete "Test".', type: 'error'}),
    ];

    deleteUserEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should dispatch a busy toast if a mutation is already in progress', done => {
    const action$ = of(deleteUserRequest({userId: '1', userName: 'Test'}));
    state$ = createMockState(true);

    const expectedActions = [
      showToast({
        message: 'Operation in progress. Please try again later.',
        type: 'error',
      }),
    ];

    deleteUserEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        expect(dbActions.deleteUser).not.toHaveBeenCalled();
        done();
      });
  });
});
