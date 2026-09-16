import { BaseGraphQlResult, Subscription } from '@/types';

export type SubscriptionListResponse = {
  subscriptions: Subscription[];
} & BaseGraphQlResult;
