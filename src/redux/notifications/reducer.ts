import {
  NotificationsState,
  NotificationsActionTypes,
  SHOW_TOAST,
  CLEAR_TOAST,
} from './types';

const initialState: NotificationsState = {
  toast: null,
};

export const notificationsReducer = (
  state = initialState,
  action: NotificationsActionTypes,
): NotificationsState => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        toast: action.payload,
      };
    case CLEAR_TOAST:
      return {
        ...state,
        toast: null,
      };
    default:
      return state;
  }
};
