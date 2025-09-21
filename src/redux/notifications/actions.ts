import {
  SHOW_TOAST,
  CLEAR_TOAST,
  NotificationsActionTypes,
  ToastPayload,
} from './types';

export const showToast = (payload: ToastPayload): NotificationsActionTypes => ({
  type: SHOW_TOAST,
  payload,
});

export const clearToast = (): NotificationsActionTypes => ({
  type: CLEAR_TOAST,
});
