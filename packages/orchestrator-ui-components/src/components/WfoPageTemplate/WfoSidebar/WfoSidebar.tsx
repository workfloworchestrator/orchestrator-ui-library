import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { EuiHorizontalRule, EuiSideNav, EuiSpacer } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

import { WfoIsAllowedToRender, menuItemIsAllowed } from '@/components';
import { getMenuStyles } from '@/components/WfoPageTemplate/WfoSidebar/styles';
import { WfoStartWorkflowButtonComboBox } from '@/components/WfoStartButton/WfoStartWorkflowComboBox';
import { PolicyResource } from '@/configuration/policy-resources';
import { usePolicy, useWithOrchestratorTheme } from '@/hooks';

import {
    PATH_METADATA,
    PATH_METADATA_PRODUCTS,
    PATH_METADATA_PRODUCT_BLOCKS,
    PATH_METADATA_RESOURCE_TYPES,
    PATH_METADATA_TASKS,
    PATH_METADATA_WORKFLOWS,
    PATH_SETTINGS,
    PATH_START,
    PATH_SUBSCRIPTIONS,
    PATH_TASKS,
    PATH_WORKFLOWS,
} from '../paths';
import { WfoCopyright } from './WfoCopyright';
import { WfoMenuItemLink } from './WfoMenuLink';

export const urlPolicyMap = new Map<string, PolicyResource>([
    [PATH_WORKFLOWS, PolicyResource.NAVIGATION_WORKFLOWS],
    [PATH_SUBSCRIPTIONS, PolicyResource.NAVIGATION_SUBSCRIPTIONS],
    [PATH_METADATA, PolicyResource.NAVIGATION_METADATA],
    [PATH_TASKS, PolicyResource.NAVIGATION_TASKS],
    [PATH_SETTINGS, PolicyResource.NAVIGATION_SETTINGS],
]);

export const sideNavMenuDivider: EuiSideNavItemType<object> = {
    name: '',
    id: 'menuDivider',
    renderItem: () => <EuiHorizontalRule margin="xs" />,
};

export type WfoSidebarProps = {
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
};

export const WfoSidebar: FC<WfoSidebarProps> = ({ overrideMenuItems }) => {
    const { menuStyle } = useWithOrchestratorTheme(getMenuStyles);

    const t = useTranslations('main');
    const router = useRouter();

    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
    const { isAllowed } = usePolicy();

    const toggleMobile = () => {
        setIsSideNavOpenOnMobile((openState) => !openState);
    };

    // Note: href is used to determine if the user has access to the page in
    // defaultMenuItemsFilteredByPolicy so we need to keep it in the item although we don't use it in the render.
    const defaultMenuItems: EuiSideNavItemType<object>[] = [
        {
            name: t('start'),
            id: 'start',
            isSelected: router.pathname === PATH_START,
            href: PATH_START,
            renderItem: () => (
                <WfoMenuItemLink
                    path={PATH_START}
                    translationString="start"
                    isSelected={router.pathname === PATH_START}
                />
            ),
        },
        {
            name: t('subscriptions'),
            id: 'subscriptions',
            isSelected: router.pathname.startsWith(PATH_SUBSCRIPTIONS),
            href: PATH_SUBSCRIPTIONS,
            renderItem: () => (
                <WfoMenuItemLink
                    path={PATH_SUBSCRIPTIONS}
                    translationString="subscriptions"
                    isSelected={router.pathname.startsWith(PATH_SUBSCRIPTIONS)}
                />
            ),
        },
        {
            name: t('workflows'),
            id: 'workflows',
            isSelected: router.pathname.startsWith(PATH_WORKFLOWS),
            href: PATH_WORKFLOWS,
            renderItem: () => (
                <WfoMenuItemLink
                    path={PATH_WORKFLOWS}
                    translationString="workflows"
                    isSelected={router.pathname.startsWith(PATH_WORKFLOWS)}
                />
            ),
        },
        {
            name: t('tasks'),
            isSelected: router.pathname.startsWith(PATH_TASKS),
            id: 'tasks',
            href: PATH_TASKS,
            renderItem: () => (
                <WfoMenuItemLink
                    path={PATH_TASKS}
                    translationString="tasks"
                    isSelected={router.pathname.startsWith(PATH_TASKS)}
                />
            ),
        },
        {
            name: t('metadata'),
            id: 'metadata',
            href: PATH_METADATA,
            isSelected:
                router.pathname.substring(0, PATH_METADATA.length) ===
                PATH_METADATA,
            renderItem: () => (
                <WfoMenuItemLink
                    path={PATH_METADATA_PRODUCTS}
                    translationString="metadata"
                    hasSubItems={true}
                />
            ),
            items: [
                {
                    name: t('metadataProducts'),
                    id: 'metadata-products',
                    href: PATH_METADATA_PRODUCTS,
                    renderItem: () => (
                        <WfoMenuItemLink
                            path={PATH_METADATA_PRODUCTS}
                            translationString="metadataProducts"
                            isSelected={
                                router.pathname === PATH_METADATA_PRODUCTS
                            }
                            isSubItem={true}
                        />
                    ),
                },
                {
                    name: t('metadataProductblocks'),
                    id: 'metadata-productblocks',
                    isSelected:
                        router.pathname === PATH_METADATA_PRODUCT_BLOCKS,
                    href: PATH_METADATA_PRODUCT_BLOCKS,
                    renderItem: () => (
                        <WfoMenuItemLink
                            path={PATH_METADATA_PRODUCT_BLOCKS}
                            translationString="metadataProductblocks"
                            isSelected={
                                router.pathname === PATH_METADATA_PRODUCT_BLOCKS
                            }
                            isSubItem={true}
                        />
                    ),
                },
                {
                    name: t('metadataResourceTypes'),
                    id: 'metadata-resourceTypes',
                    href: PATH_METADATA_RESOURCE_TYPES,
                    isSelected:
                        router.pathname === PATH_METADATA_RESOURCE_TYPES,
                    renderItem: () => (
                        <WfoMenuItemLink
                            path={PATH_METADATA_RESOURCE_TYPES}
                            translationString="metadataResourceTypes"
                            isSelected={
                                router.pathname === PATH_METADATA_RESOURCE_TYPES
                            }
                            isSubItem={true}
                        />
                    ),
                },
                {
                    name: t('metadataWorkflows'),
                    id: 'metadata-workflows',
                    isSelected: router.pathname === PATH_METADATA_WORKFLOWS,
                    href: PATH_METADATA_WORKFLOWS,
                    renderItem: () => (
                        <WfoMenuItemLink
                            path={PATH_METADATA_WORKFLOWS}
                            translationString="metadataWorkflows"
                            isSelected={
                                router.pathname === PATH_METADATA_WORKFLOWS
                            }
                            isSubItem={true}
                        />
                    ),
                },
                {
                    name: t('metadataTasks'),
                    id: 'metadata-tasks',
                    isSelected: router.pathname === PATH_METADATA_TASKS,
                    href: PATH_METADATA_TASKS,
                    renderItem: () => (
                        <WfoMenuItemLink
                            path={PATH_METADATA_TASKS}
                            translationString="metadataTasks"
                            isSelected={router.pathname === PATH_METADATA_TASKS}
                            isSubItem={true}
                        />
                    ),
                },
            ],
        },
        {
            name: t('settings'),
            id: 'settings',
            isSelected: router.pathname === PATH_SETTINGS,
            href: PATH_SETTINGS,
            renderItem: () => (
                <WfoMenuItemLink
                    path={PATH_SETTINGS}
                    translationString="settings"
                    isSelected={router.pathname === PATH_SETTINGS}
                />
            ),
        },
    ];

    const defaultMenuItemsFilteredByPolicy = defaultMenuItems.filter(
        ({ href }) => menuItemIsAllowed(href, urlPolicyMap, isAllowed),
    );

    const defaultMenu: EuiSideNavItemType<object>[] = [
        {
            renderItem: () => (
                <>
                    <WfoIsAllowedToRender
                        resource={PolicyResource.SUBSCRIPTION_CREATE}
                    >
                        <WfoStartWorkflowButtonComboBox />
                    </WfoIsAllowedToRender>
                    <EuiSpacer size="xl" />
                    <WfoCopyright />
                </>
            ),
            name: 'Menu',
            id: '1',
            items: overrideMenuItems
                ? overrideMenuItems(defaultMenuItemsFilteredByPolicy)
                : defaultMenuItemsFilteredByPolicy,
        },
    ];

    return (
        <EuiSideNav
            css={menuStyle}
            mobileTitle={t('mobileTitle')}
            toggleOpenOnMobile={toggleMobile}
            isOpenOnMobile={isSideNavOpenOnMobile}
            items={defaultMenu}
        />
    );
};
