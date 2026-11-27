import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_SUBSCRIPTIONS, WfoSubscriptionListTab, WfoSummaryCard } from '@/components';
import { useSearchQuery } from '@/rtk';
import { Filter } from '@/types';
import { optionalArrayMapper } from '@/utils';
import { WfoQueryParams, getUrlWithQueryParams } from '@/utils/getQueryParams';

import { getCountColor } from '../getCountColor';
import { mapSubscriptionSearchResultToSummaryCardListItem } from '../mappers';
import { getSubscriptionSummarySearchPayload } from '../searchPayloads';

const OUT_OF_SYNC_CEL =
  'subscription.insync == "false" && (subscription.status == "provisioning" || subscription.status == "active")';

// Elasticsearch equivalent of OUT_OF_SYNC_CEL. The list page produces the same clauses from the
// CEL in the button link, so the count on the card matches the list.
const outOfSyncSubscriptionsFilter = {
  bool: {
    must: [
      { term: { 'subscription.insync': 'false' } },
      {
        bool: {
          should: [{ term: { 'subscription.status': 'active' } }, { term: { 'subscription.status': 'provisioning' } }],
        },
      },
    ],
  },
} as unknown as Filter;

const outOfSyncSubscriptionsSearchPayload = getSubscriptionSummarySearchPayload(outOfSyncSubscriptionsFilter);

export const WfoLatestOutOfSyncSubscriptionSummaryCard = () => {
  const t = useTranslations('startPage.outOfSyncSubscriptions');

  const { data, isFetching, isLoading } = useSearchQuery(outOfSyncSubscriptionsSearchPayload);
  const outOfSyncSubscriptionCount = data?.cursor?.total_items ?? '-';

  const queryParams = {
    [WfoQueryParams.ACTIVE_TAB]: WfoSubscriptionListTab.ALL,
    [WfoQueryParams.FILTER_STRING]: OUT_OF_SYNC_CEL,
  };

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={outOfSyncSubscriptionCount}
      color={getCountColor(outOfSyncSubscriptionCount)}
      listTitle={t('listTitle')}
      listItems={optionalArrayMapper(data?.data, mapSubscriptionSearchResultToSummaryCardListItem)}
      button={{
        name: t('buttonText'),
        url: getUrlWithQueryParams(PATH_SUBSCRIPTIONS, queryParams),
      }}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
