import { SubscriptionListResponse } from '@/rtk/endpoints/subscriptionList';
import { Subscription } from '@/types';
import { parseDate } from '@/utils';

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

export const mapGraphQlSubscriptionsResultToPageInfo = (graphqlResponse: SubscriptionListResponse) =>
  graphqlResponse.pageInfo;

export const mapGraphQlSubscriptionsResultToSubscriptionListItems = (
  graphqlResponse: SubscriptionListResponse | undefined,
): SubscriptionListItem[] => {
  if (!graphqlResponse) return [];
  return graphqlResponse.subscriptions.map((subscription) => {
    const { description, insync, product, startDate, endDate, status, subscriptionId, note, customer, metadata } =
      subscription;

    const { name: productName, tag } = product;
    const { fullname: customerFullname, shortcode: customerShortcode } = customer;

    return {
      subscriptionId,
      description,
      status,
      insync,
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
      note,
      productName,
      tag,
      customerFullname,
      customerShortcode,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
    };
  });
};
