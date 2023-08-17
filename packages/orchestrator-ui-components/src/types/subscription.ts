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
    note: string;
    startDate: string;
    endDate: string;
    insync: boolean;
    status: SubscriptionStatus;
    product: Pick<ProductDefinition, 'name' | 'tag' | 'productType'>;
};
