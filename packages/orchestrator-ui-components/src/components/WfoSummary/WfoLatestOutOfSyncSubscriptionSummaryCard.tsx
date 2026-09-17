import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_SUBSCRIPTIONS, SummaryCardStatus, WfoSubscriptionListTab, WfoSummaryCard } from '@/components';
import { mapSubscriptionSearchResultToSummaryCardListItem } from '@/pages/startPage/mappers';
import { getSubscriptionSummarySearchPayload } from '@/pages/startPage/searchPayloads';
import { useSearchQuery } from '@/rtk';
import { Filter } from '@/types';
import { optionalArrayMapper } from '@/utils';
import { WfoQueryParams, getUrlWithQueryParams } from '@/utils/getQueryParams';

const OUT_OF_SYNC_CEL =
  'subscription.insync == false && (subscription.status == "provisioning" || subscription.status == "active")';

// Elasticsearch equivalent of OUT_OF_SYNC_CEL. The list page produces the same clauses from the
// CEL in the button link, so the count on the card matches the list.
const outOfSyncSubscriptionsFilter = {
  bool: {
    must: [
      { term: { 'subscription.insync': false } },
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

  const queryParams = {
    [WfoQueryParams.ACTIVE_TAB]: WfoSubscriptionListTab.ALL,
    [WfoQueryParams.FILTER_STRING]: OUT_OF_SYNC_CEL,
  };

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={data?.cursor?.total_items ?? '-'}
      headerStatus={SummaryCardStatus.Error}
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
