export type ToastType = 'success' | 'error' | 'info';

export interface ToastPayload {
  message: string;
  type: ToastType;
}

export interface NotificationsState {
  toast: ToastPayload | null;
}

export const SHOW_TOAST = 'SHOW_TOAST';
export const CLEAR_TOAST = 'CLEAR_TOAST';

interface ShowToastAction {
  type: typeof SHOW_TOAST;
  payload: ToastPayload;
}

interface ClearToastAction {
  type: typeof CLEAR_TOAST;
}

export type NotificationsActionTypes = ShowToastAction | ClearToastAction;
