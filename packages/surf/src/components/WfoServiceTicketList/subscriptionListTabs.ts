import { WfoFilterTab } from '@orchestrator-ui/orchestrator-ui-components';
import { ServiceTicketDefinition } from '../../types';

export enum WfoSubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export const defaultSubscriptionsTabs: WfoFilterTab<
    WfoSubscriptionsTabType,
    ServiceTicketDefinition
>[] = [
    {
        id: WfoSubscriptionsTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'process_state',
                value: 'active',
            },
        ],
    },
    {
        id: WfoSubscriptionsTabType.TERMINATED,
        translationKey: 'terminated',
        alwaysOnFilters: [
            {
                field: 'process_state',
                value: 'terminated',
            },
        ],
    },
    {
        id: WfoSubscriptionsTabType.TRANSIENT,
        translationKey: 'transient',
        alwaysOnFilters: [
            {
                field: 'process_state',
                value: 'initial-provisioning-migrating',
            },
        ],
    },
    {
        id: WfoSubscriptionsTabType.ALL,
        translationKey: 'all',
    },
];

export const getSubscriptionsTabTypeFromString = (
    tabId?: string,
): WfoSubscriptionsTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WfoSubscriptionsTabType.ACTIVE.toString():
            return WfoSubscriptionsTabType.ACTIVE;
        case WfoSubscriptionsTabType.TERMINATED.toString():
            return WfoSubscriptionsTabType.TERMINATED;
        case WfoSubscriptionsTabType.TRANSIENT.toString():
            return WfoSubscriptionsTabType.TRANSIENT;
        case WfoSubscriptionsTabType.ALL.toString():
            return WfoSubscriptionsTabType.ALL;

        default:
            return undefined;
    }
};
