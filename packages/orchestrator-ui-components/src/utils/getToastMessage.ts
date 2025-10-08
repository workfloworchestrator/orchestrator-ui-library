import { ToastTypes } from '../types';
import type { Toast } from '../types';

export const getToastMessage = (
    type: ToastTypes,
    text: string, // We use string here instead of Toast['text'] because we want to prevent passing in react component because they trigger an "unsynchronizable values in payload detected" error',
    title: string, // same as above for string instead of Toast['title']
) => {
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
