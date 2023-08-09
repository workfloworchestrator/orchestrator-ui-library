import { WFOProcessListTabType } from '../../pages';
// Todo: This circular dependency will be resolved when moving subscriptions page to lib
// https://github.com/workfloworchestrator/orchestrator-ui/issues/149
import { WFOSubscriptionsTabType } from 'wfo-ui/pages/subscriptions';

export const getSubscriptionsTabTypeFromString = (
    tabId?: string,
): WFOSubscriptionsTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WFOSubscriptionsTabType.ACTIVE.toString():
            return WFOSubscriptionsTabType.ACTIVE;
        case WFOSubscriptionsTabType.TERMINATED.toString():
            return WFOSubscriptionsTabType.TERMINATED;
        case WFOSubscriptionsTabType.TRANSIENT.toString():
            return WFOSubscriptionsTabType.TRANSIENT;
        case WFOSubscriptionsTabType.ALL.toString():
            return WFOSubscriptionsTabType.ALL;

        default:
            return undefined;
    }
};

// Todo might need to move closer to the consuming component or find a more generic way
export const getProcessListTabTypeFromString = (
    tabId?: string,
): WFOProcessListTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case WFOProcessListTabType.ACTIVE.toString():
            return WFOProcessListTabType.ACTIVE;
        case WFOProcessListTabType.COMPLETED.toString():
            return WFOProcessListTabType.COMPLETED;

        default:
            return undefined;
    }
};
