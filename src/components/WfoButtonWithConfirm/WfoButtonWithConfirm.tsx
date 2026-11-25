import React, { useContext } from 'react';

import { EuiButtonIcon, IconType } from '@elastic/eui';

import { ConfirmationDialogContext } from '@/contexts';

interface WfoButtonWithConfirmProps {
  question: string;
  onConfirm: () => void;
  iconType?: IconType;
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
