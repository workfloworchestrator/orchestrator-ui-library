import React from 'react';

import { useTranslations } from 'next-intl';

import { PATH_SUBSCRIPTIONS, SummaryCardStatus, WfoSubscriptionListTab, WfoSummaryCard } from '@/components';
import { mapSubscriptionSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { outOfSyncSubscriptionsListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetSubscriptionSummaryListQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';
import { WfoQueryParams, getUrlWithQueryParams } from '@/utils/getQueryParams';

export const WfoLatestOutOfSyncSubscriptionSummaryCard = () => {
  const t = useTranslations('startPage.outOfSyncSubscriptions');

  const {
    data: outOfSyncSubscriptionsSummaryResult,
    isFetching,
    isLoading,
  } = useGetSubscriptionSummaryListQuery(outOfSyncSubscriptionsListSummaryQueryVariables);

  const queryParams = {
    [WfoQueryParams.ACTIVE_TAB]: WfoSubscriptionListTab.ALL,
    [WfoQueryParams.FILTER_STRING]:
      'subscription.insync == false && (subscription.status == "provisioning" || subscription.status == "active")',
  };

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={outOfSyncSubscriptionsSummaryResult?.pageInfo.totalItems ?? '-'}
      headerStatus={SummaryCardStatus.Error}
      listTitle={t('listTitle')}
      listItems={optionalArrayMapper(
        outOfSyncSubscriptionsSummaryResult?.subscriptions,
        mapSubscriptionSummaryToSummaryCardListItem,
      )}
      button={{
        name: t('buttonText'),
        url: getUrlWithQueryParams(PATH_SUBSCRIPTIONS, queryParams),
      }}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
