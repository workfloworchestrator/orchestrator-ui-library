import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_SUBSCRIPTIONS, SummaryCardStatus, WfoSummaryCard } from '@/components';
import { mapSubscriptionSearchResultToSummaryCardListItem } from '@/pages/startPage/mappers';
import { getSubscriptionSummarySearchPayload } from '@/pages/startPage/searchPayloads';
import { useSearchQuery } from '@/rtk';
import { Filter } from '@/types';
import { optionalArrayMapper } from '@/utils';

// Elasticsearch equivalent of the list page's default Active tab filter
// (`subscription.status == "active"`), so the count on the card matches the list.
const activeSubscriptionsFilter = {
  bool: {
    must: [{ term: { 'subscription.status': 'active' } }],
  },
} as unknown as Filter;

const activeSubscriptionsSearchPayload = getSubscriptionSummarySearchPayload(activeSubscriptionsFilter);

export const WfoLatestActiveSubscriptionsSummaryCard = () => {
  const t = useTranslations('startPage.activeSubscriptions');

  const { data, isFetching, isLoading } = useSearchQuery(activeSubscriptionsSearchPayload);

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={data?.cursor?.total_items ?? '-'}
      headerStatus={SummaryCardStatus.Neutral}
      listTitle={t('listTitle')}
      listItems={optionalArrayMapper(data?.data, mapSubscriptionSearchResultToSummaryCardListItem)}
      button={{ name: t('buttonText'), url: PATH_SUBSCRIPTIONS }}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
