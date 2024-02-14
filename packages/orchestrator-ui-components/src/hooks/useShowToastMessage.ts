import { useAppDispatch } from '@/rtk/hooks';
import { addToastMessage } from '@/rtk/slices/toastMessages';
import { ToastTypes } from '@/types';
import { getToastMessage } from '@/utils/getToastMessage';

export const useShowToastMessage = () => {
    const dispatch = useAppDispatch();

    const showToastMessage = (
        type: ToastTypes,
        text: string, // We use string here instead of Toast['text'] because we want to prevent passing in react component because they trigger an "unsynchronizable values in payload detected" error',
        title: string, // same as above for string instead of Toast['title'],
    ) => {
        const toastMessage = getToastMessage(type, text, title);
        dispatch(addToastMessage(toastMessage));
    };

    return {
        showToastMessage,
    };
};
