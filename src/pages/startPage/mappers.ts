import { PATH_SUBSCRIPTIONS, PATH_WORKFLOWS } from '@/components';
import { SummaryCardListItem } from '@/components/WfoSummary';
import { ProcessSummary } from '@/rtk';
import { SearchResult } from '@/types';
import { formatDate } from '@/utils';

import {
  SUBSCRIPTION_DESCRIPTION_COLUMN,
  SUBSCRIPTION_ID_COLUMN,
  SUBSCRIPTION_START_DATE_COLUMN,
} from './searchPayloads';

export const mapProcessSummaryToSummaryCardListItem = (processSummary: ProcessSummary): SummaryCardListItem => ({
  title: processSummary.workflowName,
  value: formatDate(processSummary?.startedAt),
  url: `${PATH_WORKFLOWS}/${processSummary.processId}`,
});

export const mapSubscriptionSearchResultToSummaryCardListItem = (result: SearchResult): SummaryCardListItem => {
  const { response_columns } = result;
  return {
    title: String(response_columns[SUBSCRIPTION_DESCRIPTION_COLUMN] ?? ''),
    value: formatDate(response_columns[SUBSCRIPTION_START_DATE_COLUMN] as string | null),
    url: `${PATH_SUBSCRIPTIONS}/${response_columns[SUBSCRIPTION_ID_COLUMN]}`,
  };
};
