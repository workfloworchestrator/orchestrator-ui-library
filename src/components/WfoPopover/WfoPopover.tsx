import React from 'react';

import { EuiContextMenuPanel, EuiLoadingSpinner, EuiPanel, EuiPopover } from '@elastic/eui';

interface WfoPopoverProps {
  id: string;
  isLoading: boolean;
  PopoverContent: string | React.JSXElementConstructor<unknown>;
  button: NonNullable<React.ReactNode> | undefined;
  isPopoverOpen: boolean;
  closePopover: () => void;
}

export const WfoPopover = ({ id, isLoading, PopoverContent, button, isPopoverOpen, closePopover }: WfoPopoverProps) => {
  return (
    <EuiPopover
      id={id}
      button={button}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      panelPaddingSize="none"
      anchorPosition="downLeft"
    >
      {/*
       * EUI 122 added `padding: size.s` to `.euiContextMenuPanel`, which EUI 113 did not have.
       * Combined with the EuiPanel below it inset the content and read as a second, inner border.
       * Reset it here so the popover keeps its previous spacing.
       */}
      <EuiContextMenuPanel css={{ padding: 0 }}>
        <EuiPanel hasBorder={false} color="transparent" paddingSize="s">
          {isLoading ?
            <EuiLoadingSpinner />
          : <PopoverContent />}
        </EuiPanel>
      </EuiContextMenuPanel>
    </EuiPopover>
  );
};
