import { WFOFilterTab } from '../../components';
import { SubscriptionListItem } from './types';

export enum WFOSubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export const defaultSubscriptionsTabs: WFOFilterTab<
    WFOSubscriptionsTabType,
    SubscriptionListItem
>[] = [
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
