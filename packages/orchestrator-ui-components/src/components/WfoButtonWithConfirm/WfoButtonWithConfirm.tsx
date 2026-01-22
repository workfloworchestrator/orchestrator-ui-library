import React, { useContext } from 'react';

import { EuiButtonIcon } from '@elastic/eui';
import type { EuiIconType } from '@elastic/eui/src/components/icon/icon';

import { ConfirmationDialogContext } from '@/contexts';

interface WfoButtonWithConfirmProps {
    question: string;
    onConfirm: () => void;
    iconType?: EuiIconType;
    ariaLabel?: string;
}

export const WfoButtonWithConfirm = ({
    question,
    onConfirm,
    iconType = 'trash',
    ariaLabel = 'Confirmation button',
}: WfoButtonWithConfirmProps) => {
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);

    return (
        <EuiButtonIcon
            iconType={iconType}
            onClick={() => {
                showConfirmDialog({
                    question,
                    onConfirm,
                });
            }}
            aria-label={ariaLabel}
        />
    );
};
