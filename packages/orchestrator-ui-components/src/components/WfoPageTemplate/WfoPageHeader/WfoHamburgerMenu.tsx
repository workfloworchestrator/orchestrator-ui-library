import React, { useState } from 'react';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { EuiButtonIcon, EuiContextMenu, EuiPopover } from '@elastic/eui';
import type { EuiContextMenuPanelDescriptor } from '@elastic/eui';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import { WfoLoading } from '@/components/WfoLoading';
import { ORCHESTRATOR_UI_LIBRARY_VERSION } from '@/configuration';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon, WfoSquareStack3dStack, WfoXCircleFill } from '@/icons';
import { WfoQuestionCircle } from '@/icons/WfoQuestionCircle';
import { useGetVersionsQuery } from '@/rtk/endpoints/versions';
import { toOptionalArrayEntry } from '@/utils';

export const WfoHamburgerMenu = ({}) => {
    const t = useTranslations('hamburgerMenu');
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
        const versionsArr: [{ name: string; icon: EmotionJSX.Element }] = [
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
                    isDarkThemeActive ? theme.colors.ghost : theme.colors.ink
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
                    isDarkThemeActive ? theme.colors.ghost : theme.colors.ink
                }
            />
        ),
        onClick: handleOpenSupport,
    };

    const versionItem = {
        name: t('softwareVersions'),
        icon: <WfoSquareStack3dStack width={24} height={24} />,
        panel: 1,
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
            <EuiContextMenu
                initialPanelId={0}
                panels={panels}
                css={{ width: theme.base * 25 }}
            />
        </EuiPopover>
    );
};
