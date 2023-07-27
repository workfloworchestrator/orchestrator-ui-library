import { EuiTab, EuiTabs } from '@elastic/eui';
import React, { FC } from 'react';
import { useTranslations } from 'next-intl';

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
    translationKey: string;
    alwaysOnFilters?: FilterQuery[];
};

export const defaultSubscriptionsTabs: SubscriptionsTab[] = [
    {
        id: SubscriptionsTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'active',
            },
        ],
    },
    {
        id: SubscriptionsTabType.TERMINATED,
        translationKey: 'terminated',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'terminated',
            },
        ],
    },
    {
        id: SubscriptionsTabType.TRANSIENT,
        translationKey: 'transient',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'initial-provisioning-migrating',
            },
        ],
    },
    {
        id: SubscriptionsTabType.ALL,
        translationKey: 'all',
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
}) => {
  const t = useTranslations('subscriptions.tabs')
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
  )
};
