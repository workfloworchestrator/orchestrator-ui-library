import React, { useState } from 'react';

import { signOut } from 'next-auth/react';

import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';
import type { EuiContextMenuPanelDescriptor } from '@elastic/eui';

import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon } from '@/icons';
import { WfoQuestionCircle } from '@/icons/WfoQuestionCircle';
import { toOptionalArrayEntry } from '@/utils';

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

    const logoutItem = {
        name: 'Logout',
        icon: (
            <WfoLogoutIcon
                color={
                    isDarkThemeActive ? theme.colors.ghost : theme.colors.ink
                }
            />
        ),
        onClick: () => signOut(),
    };

    const supportItem = {
        name: 'Support',
        icon: (
            <WfoQuestionCircle
                color={
                    isDarkThemeActive ? theme.colors.ghost : theme.colors.ink
                }
            />
        ),
        onClick: handleOpenSupport,
    };

    const panelItems = [
        ...toOptionalArrayEntry(supportItem, enableSupportMenuItem),
        { ...logoutItem },
    ];

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
