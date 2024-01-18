import { WfoFilterTab } from '../../components';
import { SubscriptionListItem } from './subscriptionResultMappers';

export enum WfoSubscriptionListTab {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export const subscriptionListTabs: WfoFilterTab<
    WfoSubscriptionListTab,
    SubscriptionListItem
>[] = [
    {
        id: WfoSubscriptionListTab.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'active',
            },
        ],
    },
    {
        id: WfoSubscriptionListTab.TERMINATED,
        translationKey: 'terminated',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'terminated',
            },
        ],
    },
    {
        id: WfoSubscriptionListTab.TRANSIENT,
        translationKey: 'transient',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'initial-provisioning-migrating',
            },
        ],
    },
    {
        id: WfoSubscriptionListTab.ALL,
        translationKey: 'all',
    },
];
