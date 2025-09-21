import {useEffect} from 'react';
import {useAppSelector, useAppDispatch} from '../../redux/hooks';
import {clearToast} from '../../redux/notifications/actions';
import {ToastService} from '../../services/ToastService';

const GlobalToastManager = () => {
  const dispatch = useAppDispatch();
  const {toast} = useAppSelector(state => state.notifications);

  useEffect(() => {
    if (toast) {
      const {message, type} = toast;
      if (type === 'success') {
        ToastService.showSuccess(message);
      } else if (type === 'error') {
        ToastService.showError(message);
      }
      // clear after showing it
      dispatch(clearToast());
    }
  }, [toast, dispatch]);

  return null;
};

export default GlobalToastManager;
