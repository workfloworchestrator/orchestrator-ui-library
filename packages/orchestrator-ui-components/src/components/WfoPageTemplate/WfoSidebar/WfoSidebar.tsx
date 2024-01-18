import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { EuiSideNav, EuiSpacer } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components/src/hooks';

import {
    PATH_METADATA,
    PATH_METADATA_PRODUCTS,
    PATH_METADATA_PRODUCT_BLOCKS,
    PATH_METADATA_RESOURCE_TYPES,
    PATH_METADATA_WORKFLOWS,
    PATH_SETTINGS,
    PATH_START,
    PATH_SUBSCRIPTIONS,
    PATH_TASKS,
    PATH_WORKFLOWS,
} from '../paths';
import { WfoStartCreateWorkflowButtonComboBox } from './WfoStartCreateWorkflowButtonComboBox';

export type WfoSidebarProps = {
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
};

export const WfoSidebar: FC<WfoSidebarProps> = ({ overrideMenuItems }) => {
    const t = useTranslations('main');
    const router = useRouter();
    const { theme } = useOrchestratorTheme();
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);

    const toggleMobile = () => {
        setIsSideNavOpenOnMobile((openState) => !openState);
    };

    const defaultMenuItems: EuiSideNavItemType<object>[] = [
        {
            name: t('start'),
            id: '2',
            isSelected: router.pathname === PATH_START,
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_START);
            },
        },
        {
            name: t('workflows'),
            id: '3',
            isSelected: router.pathname === PATH_WORKFLOWS,
            href: PATH_WORKFLOWS,
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_WORKFLOWS);
            },
        },
        {
            name: t('subscriptions'),
            id: '4',
            isSelected: router.pathname === PATH_SUBSCRIPTIONS,
            href: PATH_SUBSCRIPTIONS,
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_SUBSCRIPTIONS);
            },
        },
        {
            name: t('metadata'),
            id: '5',
            onClick: () => {
                router.push(PATH_METADATA);
            },
            items: [
                {
                    name: t('metadataProducts'),
                    id: '5.1',
                    isSelected: router.pathname === PATH_METADATA_PRODUCTS,
                    onClick: (e) => {
                        e.preventDefault();
                        router.push(PATH_METADATA_PRODUCTS);
                    },
                },
                {
                    name: t('metadataProductblocks'),
                    id: '5.2',
                    isSelected:
                        router.pathname === PATH_METADATA_PRODUCT_BLOCKS,
                    onClick: (e) => {
                        e.preventDefault();
                        router.push(PATH_METADATA_PRODUCT_BLOCKS);
                    },
                },
                {
                    name: t('metadataResourceTypes'),
                    id: '5.3',
                    isSelected:
                        router.pathname === PATH_METADATA_RESOURCE_TYPES,
                    onClick: (e) => {
                        e.preventDefault();
                        router.push(PATH_METADATA_RESOURCE_TYPES);
                    },
                },
                {
                    name: t('metadataWorkflows'),
                    id: '5.4',
                    isSelected: router.pathname === PATH_METADATA_WORKFLOWS,
                    onClick: (e) => {
                        e.preventDefault();
                        router.push(PATH_METADATA_WORKFLOWS);
                    },
                },
            ],
        },
        {
            name: t('tasks'),
            isSelected: router.pathname === PATH_TASKS,
            id: '6',
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_TASKS);
            },
            href: PATH_TASKS,
        },
        {
            name: t('settings'),
            isSelected: router.pathname === PATH_SETTINGS,
            id: '7',
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_SETTINGS);
            },
            href: PATH_SETTINGS,
        },
    ];

    const defaultMenu: EuiSideNavItemType<object>[] = [
        {
            renderItem: () => (
                <>
                    <WfoStartCreateWorkflowButtonComboBox />
                    <EuiSpacer size="m" />
                </>
            ),
            name: 'Menu',
            id: '1',
            items: overrideMenuItems
                ? overrideMenuItems(defaultMenuItems)
                : defaultMenuItems,
        },
    ];

    return (
        <div>
            <EuiSideNav
                mobileTitle={t('mobileTitle')}
                toggleOpenOnMobile={toggleMobile}
                isOpenOnMobile={isSideNavOpenOnMobile}
                items={defaultMenu}
            />
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    padding: 10,
                    fontSize: theme.size.s,
                    color: theme.colors.primaryText,
                }}
            >
                <p>
                    ©{' '}
                    <a href="https://workfloworchestrator.org/" target="_blank">
                        workfloworchestrator.org
                    </a>{' '}
                    {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
};
