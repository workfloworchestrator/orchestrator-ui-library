import React, { useContext } from 'react';
import { ToastContext } from '../../contexts';
import type { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { EuiGlobalToastList } from '@elastic/eui';

export const ToastsList = () => {
    const toastContext = useContext(ToastContext);

    return (
        toastContext.toasts && (
            <EuiGlobalToastList
                toasts={toastContext.toasts}
                dismissToast={(toast: Toast) =>
                    toastContext.removeToast(toast.id)
                }
                toastLifeTimeMs={5000}
            />
        )
    );
};
