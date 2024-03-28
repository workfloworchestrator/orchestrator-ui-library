import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { EuiSideNav, EuiSpacer } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

import { WfoIsAllowedToRender } from '@/components';
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
import { getMenuItemStyles } from './styles';

export const renderEmptyElementWhenNotAllowedByPolicy = (isAllowed: boolean) =>
    isAllowed ? undefined : () => <></>;

export const urlPolicyMap = new Map<string, PolicyResource>([
    [PATH_WORKFLOWS, PolicyResource.NAVIGATION_WORKFLOWS],
    [PATH_SUBSCRIPTIONS, PolicyResource.NAVIGATION_SUBSCRIPTIONS],
    [PATH_METADATA, PolicyResource.NAVIGATION_METADATA],
    [PATH_TASKS, PolicyResource.NAVIGATION_TASKS],
    [PATH_SETTINGS, PolicyResource.NAVIGATION_SETTINGS],
]);

export type WfoSidebarProps = {
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
};

type MenuItemProps = {
    path: string;
    translationString: string;
    isSelected: boolean;
};

const MenuItemLink: FC<MenuItemProps> = ({
    path,
    translationString,
    isSelected,
}) => {
    const t = useTranslations('main');
    const { menuItemStyle, selectedMenuItem } =
        useWithOrchestratorTheme(getMenuItemStyles);
    return (
        <Link css={isSelected ? selectedMenuItem : menuItemStyle} href={path}>
            {t(translationString)}
        </Link>
    );
};

export const WfoSidebar: FC<WfoSidebarProps> = ({ overrideMenuItems }) => {
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
            id: '2',
            isSelected: router.pathname === PATH_START,
            href: PATH_START,
            renderItem: () => (
                <MenuItemLink
                    path={PATH_START}
                    translationString="start"
                    isSelected={router.pathname === PATH_START}
                />
            ),
        },
        {
            name: t('workflows'),
            id: '3',
            isSelected: router.pathname === PATH_WORKFLOWS,
            href: PATH_WORKFLOWS,
            renderItem: () => (
                <MenuItemLink
                    path={PATH_WORKFLOWS}
                    translationString="workflows"
                    isSelected={router.pathname === PATH_WORKFLOWS}
                />
            ),
        },
        {
            name: t('subscriptions'),
            id: '4',
            isSelected: router.pathname === PATH_SUBSCRIPTIONS,
            href: PATH_SUBSCRIPTIONS,
            renderItem: () => (
                <MenuItemLink
                    path={PATH_SUBSCRIPTIONS}
                    translationString="subscriptions"
                    isSelected={router.pathname === PATH_SUBSCRIPTIONS}
                />
            ),
        },
        {
            name: t('metadata'),
            id: '5',
            href: PATH_METADATA,
            renderItem: () => (
                <MenuItemLink
                    path={PATH_METADATA}
                    translationString="metadata"
                    isSelected={router.pathname === PATH_METADATA}
                />
            ),
            items: [
                {
                    name: t('metadataProducts'),
                    id: '5.1',
                    isSelected: router.pathname === PATH_METADATA_PRODUCTS,
                    href: PATH_METADATA_PRODUCTS,
                    renderItem: () => (
                        <MenuItemLink
                            path={PATH_METADATA}
                            translationString="metadataProducts"
                            isSelected={
                                router.pathname === PATH_METADATA_PRODUCTS
                            }
                        />
                    ),
                },
                {
                    name: t('metadataProductblocks'),
                    id: '5.2',
                    isSelected:
                        router.pathname === PATH_METADATA_PRODUCT_BLOCKS,
                    href: PATH_METADATA_PRODUCT_BLOCKS,
                    renderItem: (props) => (
                        <Link
                            className={props.className}
                            href={PATH_METADATA_PRODUCT_BLOCKS}
                        >
                            {t('metadataProductblocks')}
                        </Link>
                    ),
                },
                {
                    name: t('metadataResourceTypes'),
                    id: '5.3',
                    href: PATH_METADATA_RESOURCE_TYPES,
                    isSelected:
                        router.pathname === PATH_METADATA_RESOURCE_TYPES,
                    renderItem: (props) => (
                        <Link
                            className={props.className}
                            href={PATH_METADATA_RESOURCE_TYPES}
                        >
                            {t('metadataResourceTypes')}
                        </Link>
                    ),
                },
                {
                    name: t('metadataWorkflows'),
                    id: '5.4',
                    isSelected: router.pathname === PATH_METADATA_WORKFLOWS,
                    href: PATH_METADATA_WORKFLOWS,
                    renderItem: (props) => (
                        <Link
                            className={props.className}
                            href={PATH_METADATA_WORKFLOWS}
                        >
                            {t('metadataWorkflows')}
                        </Link>
                    ),
                },
                {
                    name: t('metadataTasks'),
                    id: '5.5',
                    isSelected: router.pathname === PATH_METADATA_TASKS,
                    href: PATH_METADATA_TASKS,
                    renderItem: (props) => (
                        <Link
                            className={props.className}
                            href={PATH_METADATA_TASKS}
                        >
                            {t('metadataTasks')}
                        </Link>
                    ),
                },
            ],
        },
        {
            name: t('tasks'),
            isSelected: router.pathname === PATH_TASKS,
            id: '6',
            href: PATH_TASKS,
            renderItem: () => (
                <MenuItemLink
                    path={PATH_TASKS}
                    translationString="tasks"
                    isSelected={router.pathname === PATH_TASKS}
                />
            ),
        },
        {
            name: t('settings'),
            isSelected: router.pathname === PATH_SETTINGS,
            id: '7',
            href: PATH_SETTINGS,
            renderItem: () => (
                <MenuItemLink
                    path={PATH_SETTINGS}
                    translationString="settings"
                    isSelected={router.pathname === PATH_SETTINGS}
                />
            ),
        },
    ];

    const defaultMenuItemsFilteredByPolicy = defaultMenuItems.filter(
        ({ href }) => {
            if (!href) {
                return true;
            }

            const policyResource = urlPolicyMap.get(href);

            return policyResource ? isAllowed(policyResource) : true;
        },
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
                    <EuiSpacer size="m" />
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
        <>
            <EuiSideNav
                mobileTitle={t('mobileTitle')}
                toggleOpenOnMobile={toggleMobile}
                isOpenOnMobile={isSideNavOpenOnMobile}
                items={defaultMenu}
            />
        </>
    );
};
