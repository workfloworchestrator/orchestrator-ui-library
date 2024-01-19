import { useAppDispatch } from '@/rtk/hooks';
import { addToastMessage } from '@/rtk/slices/toastMessages';
import { Toast, ToastTypes } from '@/types';

export const useShowToastMessage = () => {
    const dispatch = useAppDispatch();

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

    const showToastMessage = (
        type: ToastTypes,
        text: string, // We use string here instead of Toast['text'] because we want to prevent passing in react component because they trigger an "unsynchronizable values in payload detected" error',
        title: string, // same as above for string instead of Toast['title'],
    ) => {
        const id = Math.floor(Math.random() * 10000000).toString();
        const typeProps = getTypeProps(type);

        const toast: Toast = {
            id,
            text,
            title,
            ...typeProps,
        };
        dispatch(addToastMessage(toast));
    };

    return {
        showToastMessage,
    };
};
