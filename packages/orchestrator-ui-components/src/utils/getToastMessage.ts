import { ReactNode } from 'react';

import { ToastTypes } from '@/types';
import type { Toast } from '@/types';

export const getToastMessage = (type: ToastTypes, text: ReactNode, title: string) => {
  const getTypeProps = (type: ToastTypes): Partial<Toast> => {
    switch (type) {
      case ToastTypes.ERROR:
        return {
          color: 'danger',
          iconType: 'warning',
        };
      case ToastTypes.SUCCESS:
        return {
          color: 'success',
          iconType: 'check',
        };
    }
  };

  const id = Math.floor(Math.random() * 10000000).toString();
  const typeProps = getTypeProps(type);

  const toast: Toast = {
    id,
    text,
    title,
    ...typeProps,
  };

  return toast;
};
