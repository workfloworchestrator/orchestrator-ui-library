import React, { FC } from 'react';
import { EuiSideNav, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';
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
    const router = useRouter();

    return (
        <EuiSideNav
            mobileTitle="Nav Items"
            isOpenOnMobile={false}
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
                            css: { color: '#eeeeee' },
                            name: 'Start',
                            id: '2',
                            isSelected: router.pathname === PATH_START,
                            onClick: (e) => {
                                e.preventDefault();
                                router.push(PATH_START);
                            },
                        },
                        {
                            css: { color: '#eeeeee' },
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
                            css: { color: '#eeeeee' },
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
                            css: { color: '#eeeeee' },
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
                            css: { color: '#eeeeee' },
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
                            css: { color: '#eeeeee' },
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
