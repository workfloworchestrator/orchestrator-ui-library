import { EuiTab, EuiTabs } from '@elastic/eui';
import { FC } from 'react';

export enum SubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export type SubscriptionsTab = {
    id: SubscriptionsTabType;
    name: string;
    alwaysOnFilters?: [string, string][];
};

export const defaultSubscriptionsTabs: SubscriptionsTab[] = [
    {
        id: SubscriptionsTabType.ACTIVE,
        name: 'Active',
        alwaysOnFilters: [['status', 'active']],
    },
    {
        id: SubscriptionsTabType.TERMINATED,
        name: 'Terminated',
        alwaysOnFilters: [['status', 'terminated']],
    },
    {
        id: SubscriptionsTabType.TRANSIENT,
        name: 'Transient',
        alwaysOnFilters: [['status', 'initial-provisioning-migrating']],
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
