import React from 'react';
import { createContext, useState } from 'react';

import WfoConfirmationDialog from '../components/confirmationDialog/WfoConfirmationDialog';

export interface ConfirmDialogActions {
    showConfirmDialog: ShowConfirmDialogType;
    closeConfirmDialog: (
        e:
            | React.KeyboardEvent<HTMLDivElement>
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | undefined,
        confirm?: boolean,
    ) => void;
}

export interface ShowConfirmDialog {
    question: string;
    confirmAction: ConfirmDialogActions['closeConfirmDialog'];
    cancelAction?: ConfirmDialogActions['closeConfirmDialog'];
    leavePage?: boolean;
    isError?: boolean;
}

export type ShowConfirmDialogType = ({
    question,
    confirmAction,
    cancelAction,
    leavePage,
    isError,
}: ShowConfirmDialog) => void;

export const ConfirmationDialogContext = createContext<ConfirmDialogActions>({
    showConfirmDialog: () => {},
    closeConfirmDialog: () => {},
});

export const ConfirmationDialogProvider = ConfirmationDialogContext.Provider;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ConfirmationDialogContextWrapper({ children }: any) {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [state, setState] = useState<{
        confirmationDialogQuestion: string;
        confirmDialogAction: ConfirmDialogActions['closeConfirmDialog'];
        leavePage: boolean;
        isError: boolean;
    }>({
        confirmationDialogQuestion: '',
        confirmDialogAction: () => {},
        leavePage: false,
        isError: false,
    });

    const closeConfirmDialog = () => setConfirmationDialogOpen(false);

    const showConfirmDialog = ({
        question,
        confirmAction,
        cancelAction,
        leavePage,
        isError,
    }: ShowConfirmDialog) => {
        setConfirmationDialogOpen(true);
        setState({
            confirmationDialogQuestion: question,
            leavePage: !!leavePage,
            isError: !!isError,
            confirmDialogAction: (e, cancelConfirm = false) => {
                closeConfirmDialog();

                if (!cancelConfirm) {
                    return confirmAction(e);
                }

                if (cancelAction) {
                    return cancelAction(e);
                }
            },
        });
    };

    return (
        <ConfirmationDialogProvider
            value={{ showConfirmDialog, closeConfirmDialog }}
        >
            <WfoConfirmationDialog
                isOpen={confirmationDialogOpen}
                cancel={(e) => state.confirmDialogAction(e, true)}
                confirm={state.confirmDialogAction}
                question={state.confirmationDialogQuestion}
                leavePage={state.leavePage}
                isError={state.isError}
            />
            {children}
        </ConfirmationDialogProvider>
    );
}
