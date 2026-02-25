import React from 'react';

import { EuiGlobalToastList } from '@elastic/eui';

import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { removeToastMessage } from '@/rtk/slices';

export const WfoToastsList = () => {
  const toastMessages = useAppSelector((state) => state.toastMessages.messages);
  const dispatch = useAppDispatch();
  return (
    toastMessages && (
      <EuiGlobalToastList
        toasts={toastMessages}
        dismissToast={(toast) => dispatch(removeToastMessage(toast.id))}
        toastLifeTimeMs={5000}
      />
    )
  );
};
