// Todo: preparation for moving the Subscriptions component (table) to the lib
// https://github.com/workfloworchestrator/orchestrator-ui/issues/149
export type SubscriptionListItem = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: Date | null;
    endDate: Date | null;
    productName: string;
    tag: string | null;
    note: string | null;
};
