import { PATH_SUBSCRIPTIONS, PATH_WORKFLOWS } from '@/components';
import { SummaryCardListItem } from '@/components/WfoSummary';
import { ProcessSummary } from '@/rtk';
import { SearchResult, SubscriptionSummary } from '@/types';
import { formatDate } from '@/utils';

export const mapProcessSummaryToSummaryCardListItem = (processSummary: ProcessSummary): SummaryCardListItem => ({
  title: processSummary.workflowName,
  value: formatDate(processSummary?.startedAt),
  url: `${PATH_WORKFLOWS}/${processSummary.processId}`,
});

export const mapSubscriptionSummaryToSummaryCardListItem = (
  subscription: SubscriptionSummary,
): SummaryCardListItem => ({
  title: subscription.description,
  value: formatDate(subscription.startDate),
  url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
});

export const mapSubscriptionSearchResultToSummaryCardListItem = (result: SearchResult): SummaryCardListItem => {
  const { response_columns } = result;
  return {
    title: String(response_columns['subscription.description'] ?? ''),
    value: formatDate(response_columns['subscription.start_date'] as string | null),
    url: `${PATH_SUBSCRIPTIONS}/${response_columns['subscription.subscription_id']}`,
  };
};
