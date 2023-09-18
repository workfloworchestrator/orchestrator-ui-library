export type SubscriptionListItem = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: string | null;
    endDate: string | null;
    productName: string;
    tag: string | null;
    note: string | null;
};
