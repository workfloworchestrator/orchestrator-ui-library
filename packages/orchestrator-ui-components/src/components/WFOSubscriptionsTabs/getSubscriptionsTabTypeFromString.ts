import { WFOSubscriptionsTabType } from './WFOSubscriptionsTabs';

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
