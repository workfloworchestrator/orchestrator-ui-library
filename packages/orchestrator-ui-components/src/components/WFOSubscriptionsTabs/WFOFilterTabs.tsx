import React from 'react';
import { EuiTab, EuiTabs } from '@elastic/eui';
import { useTranslations } from 'next-intl';

export enum WFOSubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export enum WFOProcessListTabType {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

export const defaultSubscriptionsTabs: WFOFilterTab<WFOSubscriptionsTabType>[] =
    [
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

export const defaultProcessListTabs: WFOFilterTab<WFOProcessListTabType>[] = [
    {
        id: WFOProcessListTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'created-running-suspended-waiting-failed-resumed',
            },
        ],
    },
    {
        id: WFOProcessListTabType.COMPLETED,
        translationKey: 'completed',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'active',
            },
        ],
    },
];

////////

export type FilterQuery = {
    field: string;
    value: string;
};

export type WFOFilterTab<T> = {
    id: T;
    translationKey: string;
    alwaysOnFilters?: FilterQuery[];
};

export type WFOFilterTabsProps<T> = {
    tabs: WFOFilterTab<T>[];
    selectedSubscriptionsTab: T;
    onChangeSubscriptionsTab: (updatedSubscriptionsTab: T) => void;
};

export const WFOFilterTabs = <T extends string>({
    tabs,
    selectedSubscriptionsTab,
    onChangeSubscriptionsTab,
}: WFOFilterTabsProps<T>) => {
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
