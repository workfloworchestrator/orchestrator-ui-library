import { SearchPayload } from '@/rtk';
import { EntityKind, Filter } from '@/types';

export const SUBSCRIPTION_ID_COLUMN = 'subscription.subscription_id';
export const SUBSCRIPTION_DESCRIPTION_COLUMN = 'subscription.description';
export const SUBSCRIPTION_START_DATE_COLUMN = 'subscription.start_date';

const SUMMARY_CARD_ITEM_COUNT = 5;

/**
 * Builds the search payload shared by the subscription summary cards on the start page: the five
 * most recently started subscriptions matching `filters`, with just the columns the card renders.
 * `filters` is an Elasticsearch bool query, the same shape the subscriptions list page sends.
 */
export const getSubscriptionSummarySearchPayload = (filters: Filter): SearchPayload => ({
  entity_type: EntityKind.SUBSCRIPTION,
  query: '',
  filters,
  limit: SUMMARY_CARD_ITEM_COUNT,
  order_by: { element: SUBSCRIPTION_START_DATE_COLUMN, direction: 'desc' },
  response_columns: [SUBSCRIPTION_ID_COLUMN, SUBSCRIPTION_DESCRIPTION_COLUMN, SUBSCRIPTION_START_DATE_COLUMN],
});
