import React from 'react';
import { EuiGlobalToastList } from '@elastic/eui';
import type { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { createContext, useReducer, FC } from 'react';
import type { ReactElement, Reducer } from 'react';

export interface ToastContext {
    addToast: (type: ToastTypes, text: ReactElement) => void;
    removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContext>({
    addToast: () => {},
    removeToast: () => {},
});

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

/**
id: string;
text?: ReactChild;
toastLifeTimeMs?: number;
  title?: ReactNode;
color?: ToastColor;
iconType?: IconType;
onClose?: () => void;
className?: string;
'aria-label'?: string;
'data-test-subj'?: string;
css?: Interpolation<Theme>;
 */

interface ToastsContextProviderProps {
    children: ReactElement;
}

export const ToastsContextProvider: FC<ToastsContextProviderProps> = ({
    children,
}) => {
    const initialState: ToastsState = {
        toasts: [],
    };
    const [state, dispatch] = useReducer<
        Reducer<ToastsState, ToastAddAction | ToastRemoveAction>
    >(toastsReducer, initialState);

    const addToast = (type: ToastTypes, text: ReactElement) => {
        console.log('ADDING A MESSAGEE');
        const id = Math.floor(Math.random() * 10000000).toString();
        dispatch({
            type: ToastActionTypes.ADD,
            payload: {
                id,
                text,
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
            }}
        >
            {children}

            <EuiGlobalToastList
                toasts={state.toasts}
                dismissToast={(toast) => removeToast(toast.id)}
                toastLifeTimeMs={5000}
            />
        </ToastContext.Provider>
    );
};
