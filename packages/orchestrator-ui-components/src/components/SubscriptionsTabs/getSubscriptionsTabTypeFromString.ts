import { SubscriptionsTabType } from './SubscriptionsTabs';

export const getSubscriptionsTabTypeFromString = (
    tabId?: string,
): SubscriptionsTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case SubscriptionsTabType.ACTIVE.toString():
            return SubscriptionsTabType.ACTIVE;
        case SubscriptionsTabType.TERMINATED.toString():
            return SubscriptionsTabType.TERMINATED;
        case SubscriptionsTabType.TRANSIENT.toString():
            return SubscriptionsTabType.TRANSIENT;
        case SubscriptionsTabType.ALL.toString():
            return SubscriptionsTabType.ALL;

        default:
            return undefined;
    }
};
