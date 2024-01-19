import React from 'react';

// import { useSelector } from 'react-redux';
import { EuiGlobalToastList } from '@elastic/eui';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

// import { RootState } from '@/rtk/store';

export const WfoToastsList = () => {
    const toastMessages: Toast[] = [
        {
            id: '1',
            title: 'Title',
            color: 'success',
            iconType: 'check',
            text: 'Text',
        },
    ];

    // useSelector<RootState>(
    //(state) => state.toastMessages.messages,
    //);

    return (
        toastMessages && (
            <EuiGlobalToastList
                toasts={toastMessages as Toast[]}
                dismissToast={() =>
                    console.error('dismissToast not implemented')
                }
                toastLifeTimeMs={5000}
            />
        )
    );
};
