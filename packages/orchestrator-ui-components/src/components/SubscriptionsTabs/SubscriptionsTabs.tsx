import { EuiTab, EuiTabs } from '@elastic/eui';
import React, { FC } from 'react';

export enum SubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export type FilterQuery = {
    field: string;
    value: string;
};

export type SubscriptionsTab = {
    id: SubscriptionsTabType;
    name: string;
    alwaysOnFilters?: FilterQuery[];
};

export const defaultSubscriptionsTabs: SubscriptionsTab[] = [
    {
        id: SubscriptionsTabType.ACTIVE,
        name: 'Active',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'active',
            },
        ],
    },
    {
        id: SubscriptionsTabType.TERMINATED,
        name: 'Terminated',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'terminated',
            },
        ],
    },
    {
        id: SubscriptionsTabType.TRANSIENT,
        name: 'Transient',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'initial-provisioning-migrating',
            },
        ],
    },
    {
        id: SubscriptionsTabType.ALL,
        name: 'All',
    },
];

export type SubscriptionsTabsProps = {
    tabs: SubscriptionsTab[];
    selectedSubscriptionsTab: SubscriptionsTabType;
    onChangeSubscriptionsTab: (
        updatedSubscriptionsTab: SubscriptionsTabType,
    ) => void;
};

export const SubscriptionsTabs: FC<SubscriptionsTabsProps> = ({
    tabs,
    selectedSubscriptionsTab,
    onChangeSubscriptionsTab,
}) => (
    <EuiTabs>
        {tabs.map(({ id, name }) => (
            <EuiTab
                key={id}
                isSelected={id === selectedSubscriptionsTab}
                onClick={() =>
                    id !== selectedSubscriptionsTab &&
                    onChangeSubscriptionsTab(id)
                }
            >
                {name}
            </EuiTab>
        ))}
    </EuiTabs>
);
