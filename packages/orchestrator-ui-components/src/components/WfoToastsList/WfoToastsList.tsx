import React from 'react';

// import { useSelector } from 'react-redux';
import { EuiGlobalToastList } from '@elastic/eui';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

import { useAppDispatch, useAppSelector } from '@/rtk/hooks';
import { removeToastMessage } from '@/rtk/slices';

export const WfoToastsList = () => {
    const toastMessages = useAppSelector(
        (state) => state.toastMessages.messages,
    );
    const dispatch = useAppDispatch();
    return (
        toastMessages && (
            <EuiGlobalToastList
                toasts={toastMessages as Toast[]}
                dismissToast={(toast) => dispatch(removeToastMessage(toast.id))}
                toastLifeTimeMs={5000}
            />
        )
    );
};
