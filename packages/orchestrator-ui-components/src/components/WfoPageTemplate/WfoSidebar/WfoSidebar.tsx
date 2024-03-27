import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { EuiSideNav, EuiSpacer } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

import { WfoIsAllowedToRender } from '@/components';
import { WfoStartWorkflowButtonComboBox } from '@/components/WfoStartButton/WfoStartWorkflowComboBox';
import { PolicyResource } from '@/configuration/policy-resources';
import { usePolicy } from '@/hooks';

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
            renderItem: (props) => (
                <Link className={props.className} href={PATH_START}>
                    {t('start')}
                </Link>
            ),
        },
        {
            name: t('workflows'),
            id: '3',
            isSelected: router.pathname === PATH_WORKFLOWS,
            href: PATH_WORKFLOWS,
            renderItem: (props) => (
                <Link className={props.className} href={PATH_WORKFLOWS}>
                    {t('workflows')}
                </Link>
            ),
        },
        {
            name: t('subscriptions'),
            id: '4',
            isSelected: router.pathname === PATH_SUBSCRIPTIONS,
            href: PATH_SUBSCRIPTIONS,
            renderItem: (props) => (
                <Link className={props.className} href={PATH_SUBSCRIPTIONS}>
                    {t('subscriptions')}
                </Link>
            ),
        },
        {
            name: t('metadata'),
            id: '5',
            href: PATH_METADATA,
            renderItem: (props) => (
                <Link className={props.className} href={PATH_METADATA}>
                    {t('metadata')}
                </Link>
            ),
            items: [
                {
                    name: t('metadataProducts'),
                    id: '5.1',
                    isSelected: router.pathname === PATH_METADATA_PRODUCTS,
                    href: PATH_METADATA_PRODUCTS,
                    renderItem: (props) => (
                        <Link
                            className={props.className}
                            href={PATH_METADATA_PRODUCTS}
                        >
                            {t('metadataProducts')}
                        </Link>
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
            renderItem: (props) => (
                <Link className={props.className} href={PATH_TASKS}>
                    {t('tasks')}
                </Link>
            ),
        },
        {
            name: t('settings'),
            isSelected: router.pathname === PATH_SETTINGS,
            id: '7',
            href: PATH_SETTINGS,
            renderItem: (props) => (
                <Link className={props.className} href={PATH_SETTINGS}>
                    {t('settings')}
                </Link>
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
