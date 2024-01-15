import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '@/rtk';
import { hideConfirmDialog } from '@/rtk';

import WfoConfirmationDialog from './WfoConfirmationDialog';

export const WfoConfirmationDialogWrapper = () => {
    const isOpen = useSelector(
        (state: RootState) => state.confirmationDialog.isOpen,
    );
    const confirmDialog = useSelector(
        (state: RootState) => state.confirmationDialog.confirmDialog,
    );
    const dispatch = useDispatch();

    return (
        <WfoConfirmationDialog
            isOpen={isOpen}
            cancel={() => dispatch(hideConfirmDialog)}
            confirm={confirmDialog.confirmDialogAction}
            question={confirmDialog.confirmationDialogQuestion}
            leavePage={confirmDialog.leavePage}
            isError={confirmDialog.isError}
        />
    );
};
