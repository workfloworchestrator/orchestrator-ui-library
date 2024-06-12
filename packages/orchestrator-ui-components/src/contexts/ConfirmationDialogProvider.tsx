import React, { ReactNode } from 'react';
import { createContext, useState } from 'react';

import WfoConfirmationDialog from '../components/confirmationDialog/WfoConfirmationDialog';

export type ConfirmDialogHandler = (
    e:
        | React.KeyboardEvent<HTMLDivElement>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | undefined,
) => void;

interface ConfirmDialogState {
    onConfirm: ConfirmDialogHandler;
    question: string;
    isError?: boolean;
    subQuestion?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
}

interface ConfirmDialogContext {
    showConfirmDialog: (props: ConfirmDialogState) => void;
    closeConfirmDialog: () => void;
}

export const ConfirmationDialogContext = createContext<ConfirmDialogContext>({
    showConfirmDialog: () => {},
    closeConfirmDialog: () => {},
});

export const ConfirmationDialogProvider = ConfirmationDialogContext.Provider;

export function ConfirmationDialogContextWrapper({
    children,
}: {
    children: ReactNode;
}) {
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [
        {
            onConfirm,
            question,
            isError,
            subQuestion,
            cancelButtonText,
            confirmButtonText,
        },
        setState,
    ] = useState<ConfirmDialogState>({
        onConfirm: () => {},
        question: '',
    });

    const closeConfirmDialog = () => setConfirmationDialogOpen(false);

    const showConfirmDialog = ({
        onConfirm,
        question,
        isError = false,
        subQuestion = '',
        cancelButtonText = '',
        confirmButtonText = '',
    }: ConfirmDialogState) => {
        setConfirmationDialogOpen(true);
        setState({
            onConfirm,
            question,
            isError,
            subQuestion,
            cancelButtonText,
            confirmButtonText,
        });
    };

    return (
        <ConfirmationDialogProvider
            value={{ showConfirmDialog, closeConfirmDialog }}
        >
            <WfoConfirmationDialog
                isOpen={confirmationDialogOpen}
                onCancel={() => setConfirmationDialogOpen(false)}
                onConfirm={(e) => {
                    onConfirm(e);
                    setConfirmationDialogOpen(false);
                }}
                question={question}
                isError={isError}
                subQuestion={subQuestion}
                cancelButtonText={cancelButtonText}
                confirmButtonText={confirmButtonText}
            />
            {children}
        </ConfirmationDialogProvider>
    );
}
