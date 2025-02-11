import React, { useState } from 'react';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';
import type { EuiContextMenuPanelDescriptor } from '@elastic/eui';

import { WfoLoading } from '@/components/WfoLoading';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { WfoCog, WfoLogoutIcon, WfoXCircleFill } from '@/icons';
import { WfoQuestionCircle } from '@/icons/WfoQuestionCircle';
import { useGetVersionsQuery } from '@/rtk/endpoints/versions';
import { toOptionalArrayEntry } from '@/utils';

export const WfoHamburgerMenu = ({}) => {
    const t = useTranslations('main');
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
    const {
        data,
        isFetching,
        error: versionFetchError,
    } = useGetVersionsQuery();

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

    const versionItem = {
        name: 'Software Versions',
        icon: <WfoCog width={24} height={24} />,
        panel: 4,
    };

    if (versionFetchError) {
        console.error(versionFetchError);
    }
    const appVersionsItem = {
        id: 4,
        title: 'Software Versions',
        items: isFetching
            ? [{ name: 'Loading ...', icon: <WfoLoading /> }]
            : versionFetchError
            ? [
                  {
                      name: 'Error fetching application version data',
                      icon: <WfoXCircleFill color={theme.colors.danger} />,
                  },
              ]
            : data?.versions.applicationVersions.map((item) => {
                  return {
                      name: item,
                      icon: <WfoCog />,
                  };
              }),
    };

    const panelItems = [
        ...toOptionalArrayEntry(supportItem, enableSupportMenuItem),
        versionItem,
        { ...logoutItem },
    ];

    const panels: EuiContextMenuPanelDescriptor[] = [
        {
            id: 0,
            items: panelItems,
        },
        appVersionsItem,
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
