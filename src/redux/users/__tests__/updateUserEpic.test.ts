import {StateObservable} from 'redux-observable';
import {of, Subject} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {updateUserEpic} from '../epics';
import {
  updateUserRequest,
  submitUserSuccess,
  submitUserFailure,
  setMutating,
} from '../actions';
import {showToast} from '../../notifications/actions';
import * as dbActions from '../../../db/actions';
import {RootState} from '../../root';
import {Role} from '../../../types/types';

// Mock the db/actions module
jest.mock('../../../db/actions');

describe('updateUserEpic', () => {
  let state$: StateObservable<RootState>;

  const createMockState = (isMutating: boolean) => {
    const mockState: Partial<RootState> = {
      users: {isMutating} as any,
    };
    return new StateObservable(new Subject(), mockState as RootState);
  };

  beforeEach(() => {
    (dbActions.updateUser as jest.Mock).mockClear();
  });

  it('should handle successful user update', done => {
    (dbActions.updateUser as jest.Mock).mockResolvedValue(undefined);
    const mockUser = {
      userId: '1',
      firstName: 'Updated',
      lastName: 'User',
      role: Role.ADMIN,
      email: null,
    };
    const action$ = of(updateUserRequest(mockUser));
    state$ = createMockState(false);

    const expectedActions = [
      setMutating(true),
      submitUserSuccess(),
      showToast({message: 'User updated successfully!', type: 'success'}),
    ];

    updateUserEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should handle failed user update', done => {
    (dbActions.updateUser as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );
    const mockUser = {
      userId: '1',
      firstName: 'Updated',
      lastName: 'User',
      role: Role.ADMIN,
      email: null,
    };
    const action$ = of(updateUserRequest(mockUser));
    state$ = createMockState(false);

    const expectedActions = [
      setMutating(true),
      submitUserFailure(),
      showToast({message: 'Could not update user.', type: 'error'}),
    ];

    updateUserEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        done();
      });
  });

  it('should dispatch a busy toast if a mutation is already in progress', done => {
    const mockUser = {
      userId: '1',
      firstName: 'Updated',
      lastName: 'User',
      role: Role.ADMIN,
      email: null,
    };
    const action$ = of(updateUserRequest(mockUser));
    state$ = createMockState(true); // Set isMutating to true

    const expectedActions = [
      showToast({
        message: 'Operation in progress. Please try again later.',
        type: 'error',
      }),
    ];

    updateUserEpic(action$ as any, state$, undefined)
      .pipe(toArray())
      .subscribe(outputActions => {
        expect(outputActions).toEqual(expectedActions);
        // Ensure the database action was NOT called
        expect(dbActions.updateUser).not.toHaveBeenCalled();
        done();
      });
  });
});
