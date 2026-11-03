import type { SearchScore } from '@/rtk/graphqlSearch';
import type { SearchResult, Subscription } from '@/types';

export type SubscriptionListItem = Pick<
  Subscription,
  'subscriptionId' | 'description' | 'status' | 'insync' | 'note'
> & {
  startDate: Date | null;
  endDate: Date | null;
  productName: string;
  tag: string | null;
  customerFullname: string;
  customerShortcode: string;
  metadata: object | null;
  score: Pick<SearchResult, 'score' | 'matchingFields'> | null;
};

// A row of the subscriptions list. The keys are the GraphQL paths of the columns
export type SubscriptionSearchListItem = Pick<
  Subscription,
  'subscriptionId' | 'description' | 'status' | 'insync' | 'note'
> & {
  startDate: Date | null;
  endDate: Date | null;
  'product.name': string;
  'product.tag': string;
  'customer.fullname': string;
  'customer.shortcode': string;
  metadata: object | null;
  score: SearchScore;
};
