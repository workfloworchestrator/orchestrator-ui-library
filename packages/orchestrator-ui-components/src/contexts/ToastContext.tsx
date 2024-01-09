import React, { createContext, useReducer } from 'react';
import type { ReactElement, ReactNode, Reducer } from 'react';

import type { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

export enum ToastTypes {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
}

enum ToastActionTypes {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}

type ToastAddAction = {
    type: ToastActionTypes.ADD;
    payload: Toast; // From eui
};

type ToastRemoveAction = {
    type: ToastActionTypes.REMOVE;
    payload: {
        id: string;
    };
};

type ToastsState = {
    toasts: Toast[];
};

export interface ToastContextProps {
    addToast: (
        type: ToastTypes,
        text: ReactElement | string,
        title: string,
    ) => void;
    removeToast: (id: string) => void;
    toasts: Toast[];
}

export const ToastContext = createContext<ToastContextProps>({
    addToast: () => {},
    removeToast: () => {},
    toasts: [],
});

interface ToastsContextProviderProps {
    children: ReactNode;
}

const toastsReducer = (
    state: ToastsState,
    action: ToastAddAction | ToastRemoveAction,
): ToastsState => {
    switch (action.type) {
        case ToastActionTypes.ADD:
            return {
                toasts: [...state.toasts, action.payload],
            };
        case ToastActionTypes.REMOVE:
            const toasts = state.toasts.filter(
                (toast) => toast.id !== action.payload.id,
            );
            return {
                toasts: [...toasts],
            };

        default:
            throw new Error('Unhandled notification action type');
    }
};

export const ToastsContextProvider = ({
    children,
}: ToastsContextProviderProps) => {
    const initialState: ToastsState = {
        toasts: [],
    };

    const [state, dispatch] = useReducer<
        Reducer<ToastsState, ToastAddAction | ToastRemoveAction>
    >(toastsReducer, initialState);

    const getTypeProps = (type: ToastTypes): Partial<Toast> => {
        switch (type) {
            case ToastTypes.ERROR:
                return {
                    color: 'danger',
                    iconType: 'warning',
                };
            case ToastTypes.SUCCESS:
                return {
                    color: 'success',
                    iconType: 'check',
                };
        }
    };

    const addToast = (
        type: ToastTypes,
        text: ReactElement | string,
        title: string,
    ) => {
        const typeProps = getTypeProps(type);
        const id = Math.floor(Math.random() * 10000000).toString();
        dispatch({
            type: ToastActionTypes.ADD,
            payload: {
                id,
                text,
                title,
                ...typeProps,
            },
        });
    };

    const removeToast = (id: string) => {
        dispatch({
            type: ToastActionTypes.REMOVE,
            payload: { id },
        });
    };

    return (
        <ToastContext.Provider
            value={{
                addToast,
                removeToast,
                toasts: state.toasts,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};
