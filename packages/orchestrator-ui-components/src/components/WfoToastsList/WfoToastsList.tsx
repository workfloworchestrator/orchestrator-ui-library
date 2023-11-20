import React, { useContext } from 'react';

import { EuiGlobalToastList } from '@elastic/eui';
import type { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

import { ToastContext } from '../../contexts';

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
