import React, { FC } from 'react';
import { EuiButton, EuiSideNav, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';

const PATH_START = '/';
const PATH_NEW_PROCESS = '/new-process';
const PATH_PROCESSES = '/processes';
const PATH_SUBSCRIPTIONS = '/subscriptions';
const PATH_METADATA_PRODUCTS = '/metadata/products';
const PATH_METADATA_PRODUCT_BLOCKS = '/metadata/productblocks';
const PATH_METADATA_RESOURCE_TYPES = '/metadata/resource-types';
const PATH_METADATA_FIXED_INPUTS = '/metadata/fixed-inputs';
const PATH_METADATA_WORKFLOWS = '/metadata/workflows';
const PATH_TASKS = '/tasks';
const PATH_SETTINGS = '/settings';

export const OrchestratorSidebar: FC = () => {
    const router = useRouter();

    return (
        <EuiSideNav
            mobileTitle="Nav Items"
            isOpenOnMobile={false}
            items={[
                {
                    renderItem: () => (
                        <>
                            <EuiButton
                                onClick={(
                                    e: React.MouseEvent<
                                        HTMLButtonElement | HTMLElement,
                                        MouseEvent
                                    >,
                                ) => {
                                    e.preventDefault();
                                    router.push(PATH_NEW_PROCESS);
                                }}
                                iconType="plus"
                                fullWidth
                            >
                                New Process
                            </EuiButton>
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
                                router.push(PATH_METADATA_PRODUCTS);
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
                                    name: 'Fixed inputs',
                                    id: '5.4',
                                    isSelected:
                                        router.pathname ===
                                        PATH_METADATA_FIXED_INPUTS,
                                    onClick: (e) => {
                                        e.preventDefault();
                                        router.push(PATH_METADATA_FIXED_INPUTS);
                                    },
                                },
                                {
                                    name: 'Workflows',
                                    id: '5.5',
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
                    ],
                },
            ]}
        />
    );
};
