import { ReactNode } from 'react';

import { useAppDispatch } from '@/rtk/hooks';
import { addToastMessage } from '@/rtk/slices/toastMessages';
import { ToastTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

export const useShowToastMessage = () => {
  const dispatch = useAppDispatch();

  const showToastMessage = (
    type: ToastTypes,
    text: ReactNode,
    title: string, // same as above for string instead of Toast['title'],
  ) => {
    const toastMessage = getToastMessage(type, text, title);
    dispatch(addToastMessage(toastMessage));
  };

  return {
    showToastMessage,
  };
};
