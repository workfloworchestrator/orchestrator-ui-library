import React, { useState } from 'react';

import { signOut } from 'next-auth/react';

import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';
import type { EuiContextMenuPanelDescriptor } from '@elastic/eui';

import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon } from '@/icons';
import { WfoQuestionCircle } from '@/icons/WfoQuestionCircle';

export const WfoHamburgerMenu = ({}) => {
    const [isPopoverOpen, setPopoverIsOpen] = useState(false);
    const { theme, isDarkThemeActive } = useOrchestratorTheme();
    const { enableSupportMenuItem, supportMenuItemUrl } =
        useGetOrchestratorConfig();
    const closePopover = () => {
        setPopoverIsOpen(false);
    };
    const handleOpenSupport = async (): Promise<undefined> => {
        window.open(supportMenuItemUrl, '_blank');
    };

    const panelItems = [
        {
            name: 'Logout',
            icon: (
                <WfoLogoutIcon
                    color={
                        isDarkThemeActive
                            ? theme.colors.ghost
                            : theme.colors.ink
                    }
                />
            ),
            onClick: () => signOut(),
        },
    ];

    enableSupportMenuItem &&
        panelItems.splice(0, 0, {
            name: 'Support',
            icon: (
                <WfoQuestionCircle
                    color={
                        isDarkThemeActive
                            ? theme.colors.ghost
                            : theme.colors.ink
                    }
                />
            ),
            onClick: handleOpenSupport,
        });

    const panels: EuiContextMenuPanelDescriptor[] = [
        {
            id: 0,
            items: panelItems,
        },
    ];

    return (
        <EuiPopover
            id={'contextMenuPopoverId'}
            button={
                <EuiButtonIcon
                    iconType="menu"
                    css={{ color: theme.colors.ghost }}
                    onClick={() => setPopoverIsOpen(!isPopoverOpen)}
                />
            }
            css={{ width: theme.base * 2 }}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
        >
            <EuiContextMenu initialPanelId={0} panels={panels} />
        </EuiPopover>
    );
};
