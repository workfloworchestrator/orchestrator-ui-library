import { PATH_SUBSCRIPTIONS, PATH_WORKFLOWS } from '@/components';
import { SummaryCardListItem } from '@/components/WfoSummary';
import { ProcessSummary } from '@/rtk';
import { SubscriptionSummary } from '@/types';
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
