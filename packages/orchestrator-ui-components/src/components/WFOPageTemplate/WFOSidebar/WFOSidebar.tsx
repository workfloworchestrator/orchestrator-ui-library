import React, { FC } from 'react';
import { EuiButton, EuiSideNav, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';
import {
    PATH_METADATA,
    PATH_METADATA_PRODUCT_BLOCKS,
    PATH_METADATA_PRODUCTS,
    PATH_METADATA_RESOURCE_TYPES,
    PATH_METADATA_WORKFLOWS,
    PATH_NEW_PROCESS,
    PATH_PROCESSES,
    PATH_SETTINGS,
    PATH_START,
    PATH_SUBSCRIPTIONS,
    PATH_TASKS,
    PATH_FORMS,
} from '../paths';

export const WFOSidebar: FC = () => {
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
                            name: 'Forms test',
                            isSelected: router.pathname === PATH_FORMS,
                            id: '8',
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_FORMS);
                            },
                            href: PATH_FORMS,
                        },
                    ],
                },
            ]}
        />
    );
};
