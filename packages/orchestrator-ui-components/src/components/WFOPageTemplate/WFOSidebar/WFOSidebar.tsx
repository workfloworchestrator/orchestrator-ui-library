import React, { FC, useState } from 'react';
import { EuiSideNav, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import {
    PATH_METADATA,
    PATH_METADATA_PRODUCT_BLOCKS,
    PATH_METADATA_PRODUCTS,
    PATH_METADATA_RESOURCE_TYPES,
    PATH_METADATA_WORKFLOWS,
    PATH_PROCESSES,
    PATH_SETTINGS,
    PATH_START,
    PATH_SUBSCRIPTIONS,
    PATH_TASKS,
} from '../paths';
import { WFOStartCreateWorkflowButtonComboBox } from './WFOStartCreateWorkflowButtonComboBox';

export const WFOSidebar: FC = () => {
    const t = useTranslations('main');
    const router = useRouter();
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);

    const toggleMobile = () => {
        setIsSideNavOpenOnMobile((openState) => !openState);
    };

    return (
        <EuiSideNav
            mobileTitle={t('mobileTitle')}
            toggleOpenOnMobile={toggleMobile}
            isOpenOnMobile={isSideNavOpenOnMobile}
            items={[
                {
                    renderItem: () => (
                        <>
                            <WFOStartCreateWorkflowButtonComboBox />
                            <EuiSpacer size="m" />
                        </>
                    ),
                    name: 'Menu',
                    id: '1',
                    items: [
                        {
                            name: 'Start',
                            id: '2',
                            isSelected: router.pathname === PATH_START,
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_START);
                            },
                        },
                        {
                            name: 'Processes',
                            id: '3',
                            isSelected: router.pathname === PATH_PROCESSES,
                            href: PATH_PROCESSES,
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_PROCESSES);
                            },
                        },
                        {
                            name: 'Subscriptions',
                            id: '4',
                            isSelected: router.pathname === PATH_SUBSCRIPTIONS,
                            href: PATH_SUBSCRIPTIONS,
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_SUBSCRIPTIONS);
                            },
                        },
                        {
                            name: 'Metadata',
                            id: '5',
                            onClick: () => {
                                router.push(PATH_METADATA);
                            },
                            items: [
                                {
                                    name: 'Products',
                                    id: '5.1',
                                    isSelected:
                                        router.pathname ===
                                        PATH_METADATA_PRODUCTS,
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push(PATH_METADATA_PRODUCTS);
                                    },
                                },
                                {
                                    name: 'Productblocks',
                                    id: '5.2',
                                    isSelected:
                                        router.pathname ===
                                        PATH_METADATA_PRODUCT_BLOCKS,
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push(
                                            PATH_METADATA_PRODUCT_BLOCKS,
                                        );
                                    },
                                },
                                {
                                    name: 'Resource types',
                                    id: '5.3',
                                    isSelected:
                                        router.pathname ===
                                        PATH_METADATA_RESOURCE_TYPES,
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push(
                                            PATH_METADATA_RESOURCE_TYPES,
                                        );
                                    },
                                },
                                {
                                    name: 'Workflows',
                                    id: '5.4',
                                    isSelected:
                                        router.pathname ===
                                        PATH_METADATA_WORKFLOWS,
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push(PATH_METADATA_WORKFLOWS);
                                    },
                                },
                            ],
                        },
                        {
                            name: 'Tasks',
                            isSelected: router.pathname === PATH_TASKS,
                            id: '6',
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_TASKS);
                            },
                            href: PATH_TASKS,
                        },
                        {
                            name: 'Settings',
                            isSelected: router.pathname === PATH_SETTINGS,
                            id: '7',
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_SETTINGS);
                            },
                            href: PATH_SETTINGS,
                        },
                        {
                            name: 'Service tickets',
                            id: '8',
                            onClick: () => {
                                // Note: Using a string literal instead of const, otherwise I'll need to add the surf package to orchestrator-ui-components. Maybe here we use an ENV var ?
                                router.push('/service-tickets/active');
                            },
                            items: [
                                {
                                    name: 'Active',
                                    id: '8.1',
                                    isSelected:
                                        router.pathname ===
                                        '/service-tickets/active',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push('/service-tickets/active');
                                    },
                                },
                                {
                                    name: 'Completed',
                                    id: '8.2',
                                    isSelected:
                                        router.pathname ===
                                        '/service-tickets/completed',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push(
                                            '/service-tickets/completed',
                                        );
                                    },
                                },
                            ],
                        },
                    ],
                },
            ]}
        />
    );
};
