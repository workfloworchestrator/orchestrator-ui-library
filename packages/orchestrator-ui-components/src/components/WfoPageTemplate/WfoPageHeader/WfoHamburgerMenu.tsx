import React, { useState } from 'react';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import type { EuiContextMenuPanelDescriptor } from '@elastic/eui';
import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';

import { WfoLoading } from '@/components/WfoLoading';
import { ORCHESTRATOR_UI_LIBRARY_VERSION } from '@/configuration';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import {
    WfoChartBar,
    WfoLogoutIcon,
    WfoSquareStack3dStack,
    WfoXCircleFill,
} from '@/icons';
import { WfoQuestionCircle } from '@/icons/WfoQuestionCircle';
import { useGetVersionsQuery } from '@/rtk/endpoints/versions';
import { toOptionalArrayEntry } from '@/utils';

export const WfoHamburgerMenu = () => {
    const t = useTranslations('hamburgerMenu');
    const [isPopoverOpen, setPopoverIsOpen] = useState(false);
    const { theme, isDarkModeActive } = useOrchestratorTheme();
    const {
        enableSupportMenuItem,
        supportMenuItemUrl,
        enableAoStackStatus,
        aoStackStatusUrl,
    } = useGetOrchestratorConfig();
    const closePopover = () => {
        setPopoverIsOpen(false);
    };

    const handleOpenSupport = async (): Promise<undefined> => {
        window.open(supportMenuItemUrl, '_blank');
    };

    const handleOpenStatus = async (): Promise<undefined> => {
        window.open(aoStackStatusUrl, '_blank');
    };

    const {
        data,
        isFetching,
        error: versionFetchError,
    } = useGetVersionsQuery();

    const getVersionItems = () => {
        if (versionFetchError) {
            console.error(versionFetchError);
            return [
                {
                    name: 'Error fetching application version data',
                    icon: <WfoXCircleFill color={theme.colors.danger} />,
                },
            ];
        }
        if (isFetching) {
            return [{ name: '', icon: <WfoLoading /> }];
        }
        // initial array contains orchestrator-ui-components library version
        const versionsArr: [{ name: string; icon: React.ReactElement }] = [
            {
                name: `orchestrator-ui-components: ${ORCHESTRATOR_UI_LIBRARY_VERSION}`,
                icon: <WfoSquareStack3dStack />,
            },
        ];

        if (data === undefined) {
            return versionsArr;
        }

        const orchApiVersions = data.version.applicationVersions.map((item) => {
            return {
                name: item,
                icon: <WfoSquareStack3dStack />,
            };
        });

        // orchestrator-ui-components library version + versions returned from orchestrator api
        return versionsArr.concat(orchApiVersions);
    };

    const logoutItem = {
        name: t('logout'),
        icon: (
            <WfoLogoutIcon
                color={
                    isDarkModeActive
                        ? theme.colors.textGhost
                        : theme.colors.textInk
                }
            />
        ),
        onClick: () => signOut(),
    };

    const supportItem = {
        name: t('support'),
        icon: (
            <WfoQuestionCircle
                color={
                    isDarkModeActive
                        ? theme.colors.textGhost
                        : theme.colors.textInk
                }
            />
        ),
        onClick: handleOpenSupport,
    };

    const aoStackStatusItem = {
        name: t('aoStatusPage'),
        icon: <WfoChartBar width={26} height={26} />,
        onClick: handleOpenStatus,
    };

    const versionItem = {
        name: t('softwareVersions'),
        icon: <WfoSquareStack3dStack width={24} height={24} />,
        panel: 1,
    };

    const panelItems = [
        ...toOptionalArrayEntry(supportItem, enableSupportMenuItem),
        ...toOptionalArrayEntry(aoStackStatusItem, enableAoStackStatus),
        versionItem,
        { ...logoutItem },
    ];

    const panels: EuiContextMenuPanelDescriptor[] = [
        {
            id: 0,
            items: panelItems,
        },
        {
            id: 1,
            title: t('softwareVersions'),
            items: getVersionItems(),
        },
    ];

    return (
        <EuiPopover
            id={'contextMenuPopoverId'}
            button={
                <EuiButtonIcon
                    iconType="menu"
                    css={{ color: theme.colors.textGhost }}
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
            <EuiContextMenu
                initialPanelId={0}
                panels={panels}
                css={{ width: theme.base * 25 }}
            />
        </EuiPopover>
    );
};
