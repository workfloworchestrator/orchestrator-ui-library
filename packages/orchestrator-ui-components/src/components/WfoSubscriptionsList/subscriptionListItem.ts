import { Subscription } from '@/types';

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
};
