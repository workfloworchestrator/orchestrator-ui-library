import React from 'react';

import {
    EuiContextMenuPanel,
    EuiLoadingSpinner,
    EuiPanel,
    EuiPopover,
} from '@elastic/eui';

interface WfoPopoverProps {
    id: string;
    isLoading: boolean;
    PopoverContent: string | React.JSXElementConstructor<unknown>;
    button: NonNullable<React.ReactNode> | undefined;
    isPopoverOpen: boolean;
    closePopover: () => void;
}

export const WfoPopover = ({
    id,
    isLoading,
    PopoverContent,
    button,
    isPopoverOpen,
    closePopover,
}: WfoPopoverProps) => {
    return (
        <EuiPopover
            id={id}
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
        >
            <EuiContextMenuPanel>
                <EuiPanel color="transparent" paddingSize="s">
                    {isLoading ? <EuiLoadingSpinner /> : <PopoverContent />}
                </EuiPanel>
            </EuiContextMenuPanel>
        </EuiPopover>
    );
};
