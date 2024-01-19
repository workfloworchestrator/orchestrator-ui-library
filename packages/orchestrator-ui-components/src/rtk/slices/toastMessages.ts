import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Reducer, Slice } from '@reduxjs/toolkit';

export enum ToastTypes {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
}

type ToastState = {
    messages: Toast[];
};

const initialState: ToastState = {
    messages: [
        {
            id: '1',
            title: 'test',
            text: 'test',
            color: 'danger',
            iconType: 'alert',
            toastLifeTimeMs: 10000,
        },
    ],
};
type ToastMessagesSlice = Slice<
    ToastState,
    {
        addMessage: (
            state: ToastState,
            action: PayloadAction<Toast>,
        ) => ToastState;
        removeMessage: (
            state: ToastState,
            action: PayloadAction<Toast['id']>,
        ) => ToastState;
    },
    'toastMessages',
    'toastMessages'
>;

export const toastMessagesSlice: ToastMessagesSlice = createSlice({
    name: 'toastMessages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Toast>) => {
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        },
        removeMessage: (state, action: PayloadAction<Toast['id']>) => {
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
export const { addMessage, removeMessage } = toastMessagesSlice.actions;

export const toastMessagesReducer: Reducer<ToastState> =
    toastMessagesSlice.reducer;
