import { EuiTab, EuiTabs } from '@elastic/eui';
import React, { FC } from 'react';
import { useTranslations } from 'next-intl';

export enum WFOSubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export type FilterQuery = {
    field: string;
    value: string;
};

export type WFOSubscriptionsTab = {
    id: WFOSubscriptionsTabType;
    translationKey: string;
    alwaysOnFilters?: FilterQuery[];
};

export const defaultSubscriptionsTabs: WFOSubscriptionsTab[] = [
    {
        id: WFOSubscriptionsTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'active',
            },
        ],
    },
    {
        id: WFOSubscriptionsTabType.TERMINATED,
        translationKey: 'terminated',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'terminated',
            },
        ],
    },
    {
        id: WFOSubscriptionsTabType.TRANSIENT,
        translationKey: 'transient',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'initial-provisioning-migrating',
            },
        ],
    },
    {
        id: WFOSubscriptionsTabType.ALL,
        translationKey: 'all',
    },
];

export type WFOSubscriptionsTabsProps = {
    tabs: WFOSubscriptionsTab[];
    selectedSubscriptionsTab: WFOSubscriptionsTabType;
    onChangeSubscriptionsTab: (
        updatedSubscriptionsTab: WFOSubscriptionsTabType,
    ) => void;
};

export const WFOSubscriptionsTabs: FC<WFOSubscriptionsTabsProps> = ({
    tabs,
    selectedSubscriptionsTab,
    onChangeSubscriptionsTab,
}) => {
    const t = useTranslations('subscriptions.tabs');
    return (
        <EuiTabs>
            {tabs.map(({ id, translationKey: name }) => (
                <EuiTab
                    key={id}
                    isSelected={id === selectedSubscriptionsTab}
                    onClick={() =>
                        id !== selectedSubscriptionsTab &&
                        onChangeSubscriptionsTab(id)
                    }
                >
                    {t(name)}
                </EuiTab>
            ))}
        </EuiTabs>
    );
};
