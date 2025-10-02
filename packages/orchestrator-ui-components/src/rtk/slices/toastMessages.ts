import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Reducer, Slice } from '@reduxjs/toolkit';

import type { Toast } from '@/types';

export type ToastState = {
    messages: Toast[];
};

const initialState: ToastState = {
    messages: [],
};

type ToastMessagesSlice = Slice<
    ToastState,
    {
        addToastMessage: (
            state: ToastState,
            action: PayloadAction<Toast>,
        ) => ToastState;
        removeToastMessage: (
            state: ToastState,
            action: PayloadAction<string>,
        ) => ToastState;
    },
    'toastMessages',
    'toastMessages'
>;

export const toastMessagesSlice: ToastMessagesSlice = createSlice({
    name: 'toastMessages',
    initialState,
    reducers: {
        addToastMessage: (state, action: PayloadAction<Toast>) => {
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        },
        removeToastMessage: (state, action: PayloadAction<Toast['id']>) => {
            return {
                ...state,
                messages: state.messages.filter(
                    (message) => message.id !== action.payload,
                ),
            };
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToastMessage, removeToastMessage } =
    toastMessagesSlice.actions;

export const toastMessagesReducer: Reducer<ToastState> =
    toastMessagesSlice.reducer;
