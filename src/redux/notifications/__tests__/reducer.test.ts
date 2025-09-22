import {notificationsReducer} from '../reducer';
import {showToast, clearToast} from '../actions';
import {NotificationsState, ToastType} from '../types';

// Define the initial state for reference
const initialState: NotificationsState = {
  toast: null,
};

describe('notificationsReducer', () => {
  it('should return the initial state for an unknown action', () => {
    expect(notificationsReducer(undefined, {} as any)).toEqual(initialState);
  });

  it('should handle the SHOW_TOAST action', () => {
    const toastPayload = {
      message: 'This is a success message',
      type: 'success' as ToastType,
    };
    const action = showToast(toastPayload);
    const newState = notificationsReducer(initialState, action);

    expect(newState.toast).toEqual(toastPayload);
  });

  it('should handle the CLEAR_TOAST action', () => {
    // First, set a toast in the state
    const toastPayload = {
      message: 'An old message',
      type: 'error' as ToastType,
    };
    const activeState: NotificationsState = {toast: toastPayload};

    // Then, dispatch the clear action
    const action = clearToast();
    const newState = notificationsReducer(activeState, action);

    expect(newState.toast).toBeNull();
  });
});
