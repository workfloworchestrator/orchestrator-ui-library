import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
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
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_WORKFLOWS);
            },
        },
        {
            name: t('subscriptions'),
            id: '4',
            isSelected: router.pathname === PATH_SUBSCRIPTIONS,
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
                {
                    name: t('metadataTasks'),
                    id: '5.5',
                    isSelected: router.pathname === PATH_METADATA_TASKS,
                    onClick: (e) => {
                        e.preventDefault();
                        router.push(PATH_METADATA_TASKS);
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
        },
        {
            name: t('settings'),
            isSelected: router.pathname === PATH_SETTINGS,
            id: '7',
            onClick: (e) => {
                e.preventDefault();
                router.push(PATH_SETTINGS);
            },
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
