import { ProductDefinition } from './types';

export enum SubscriptionStatus {
    INITIAL = 'INITIAL',
    ACTIVE = 'ACTIVE',
    MIGRATING = 'MIGRATING',
    DISABLED = 'DISABLED',
    TERMINATED = 'TERMINATED',
    PROVISIONING = 'PROVISIONING',
}

export type Subscription = {
    subscriptionId: string;
    description: string;
    note: string | null;
    startDate: string | null;
    endDate: string | null;
    insync: boolean;
    status: SubscriptionStatus;
    product: Pick<ProductDefinition, 'name' | 'tag' | 'productType'>;
};

export type SubscriptionDetail = {
    subscriptionId: string;
    description: string;
    insync: boolean;
    note?: string;
    product: Pick<
        ProductDefinition,
        'createdAt' | 'name' | 'status' | 'description' | 'tag' | 'productType'
    > & {
        endDate: string;
    };
    endDate?: string;
    startDate?: string;
    status: SubscriptionStatus;
    productBlocks: {
        id: number;
        ownerSubscriptionId: string;
        parent?: number;
        resourceTypes: object;
    }[];
};
