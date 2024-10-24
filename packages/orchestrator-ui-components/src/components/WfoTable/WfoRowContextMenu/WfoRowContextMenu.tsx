import React, { FC, useState } from 'react';

import {
    EuiButtonIcon,
    EuiContextMenu,
    EuiContextMenuPanelDescriptor,
    EuiPopover,
} from '@elastic/eui';

import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';

export const WfoRowContextMenu: FC<{
    items: Array<EuiContextMenuPanelDescriptor>;
}> = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const closePopover = () => setIsOpen(false);
    const togglePopover = () => setIsOpen(!isOpen);

    return (
        <EuiPopover
            button={
                <EuiButtonIcon
                    iconType={() => <WfoDotsHorizontal />}
                    onClick={togglePopover}
                    aria-label="Row context menu"
                />
            }
            isOpen={isOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="leftUp"
        >
            <EuiContextMenu
                initialPanelId={0}
                panels={items}
                onClick={closePopover}
            />
        </EuiPopover>
    );
};
