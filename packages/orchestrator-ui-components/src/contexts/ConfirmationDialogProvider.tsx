import { createContext, useState } from 'react';
import ConfirmationDialog from '../components/confirmationDialog/ConfirmationDialog';

export interface ShowConfirmDialog {
    question: string;
    confirmAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
    cancelAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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

export interface ConfirmDialogActions {
    showConfirmDialog: ShowConfirmDialogType;
    closeConfirmDialog: () => void;
}

const ConfirmationDialogContext = createContext<ConfirmDialogActions>({
    showConfirmDialog: () => {},
    closeConfirmDialog: () => {},
});

export const ConfirmationDialogProvider = ConfirmationDialogContext.Provider;
export default ConfirmationDialogContext;

export function ConfirmationDialogContextWrapper({ children }: any) {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [state, setState] = useState({
        confirmationDialogQuestion: '',
        confirmDialogAction: (
            e: React.MouseEvent<HTMLButtonElement>,
            cancelConfirm: boolean = false,
        ) => {},
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
            confirmDialogAction: (
                e: React.MouseEvent<HTMLButtonElement>,
                cancelConfirm: boolean = false,
            ) => {
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
            <ConfirmationDialog
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
