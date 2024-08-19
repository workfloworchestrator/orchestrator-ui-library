import React, { useState } from 'react';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';
import type { EuiContextMenuPanelDescriptor } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon } from '@/icons';

export const WfoHamburgerMenu = ({}) => {
    const [isPopoverOpen, setPopoverIsOpen] = useState(false);
    const { theme, isDarkThemeActive } = useOrchestratorTheme();
    const t = useTranslations('main');

    const closePopover = () => {
        setPopoverIsOpen(false);
    };

    const panels: EuiContextMenuPanelDescriptor[] = [
        {
            id: 0,
            items: [
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
            ],
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
                    aria-label={t('openMenu')}
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
