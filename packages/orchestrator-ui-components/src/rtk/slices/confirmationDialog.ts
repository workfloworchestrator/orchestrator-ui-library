import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type ShowConfirmDialogType = ({
    question,
    confirmAction,
    cancelAction,
    leavePage,
    isError,
}: ShowConfirmDialog) => void;

interface ConfirmDialogActions {
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

interface ShowConfirmDialog {
    question: string;
    confirmAction: ConfirmDialogActions['closeConfirmDialog'];
    cancelAction?: ConfirmDialogActions['closeConfirmDialog'];
    leavePage?: boolean;
    isError?: boolean;
}

interface confirmationDialogState {
    confirmDialog?: ShowConfirmDialog;
    isOpen: boolean;
}

const initialState: confirmationDialogState = {
    confirmDialog: undefined,
    isOpen: false,
};

export const confirmationDialogSlice = createSlice({
    name: 'confirmationDialog',
    initialState,
    reducers: {
        setConfirmDialog: (state, action: PayloadAction<ShowConfirmDialog>) => {
            return { ...state, confirmDialog: action.payload };
        },
        showConfirmDialog: (state) => {
            return { ...state, isOpen: true };
        },
        hideConfirmDialog: (state) => {
            return { ...state, isOpen: false };
        },
    },
});

// Action creators are generated for each case reducer function
export const { setConfirmDialog, showConfirmDialog, hideConfirmDialog } =
    confirmationDialogSlice.actions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const confirmationDialogReducer: any = confirmationDialogSlice.reducer;
