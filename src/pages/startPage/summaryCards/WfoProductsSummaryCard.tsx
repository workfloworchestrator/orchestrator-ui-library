import React from 'react';

import { useTranslations } from 'next-intl';

import { SummaryCardListItem, WfoSummaryCard } from '@/components';
import { useGetProductsSummaryQuery } from '@/rtk';

import { productsSummaryQueryVariables } from '../queryVariables';

export const WfoProductsSummaryCard = () => {
  const t = useTranslations('startPage.products');

  const {
    data: productsSummaryResult,
    isFetching,
    isLoading,
  } = useGetProductsSummaryQuery(productsSummaryQueryVariables);

  const listItems: SummaryCardListItem[] =
    [...(productsSummaryResult?.products ?? [])]
      .sort(
        (left, right) => (right.subscriptions.pageInfo.totalItems ?? 0) - (left.subscriptions.pageInfo.totalItems ?? 0),
      )
      .map((product) => ({
        title: '',
        value: (
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{product.name}</div>
            <div>{product.subscriptions.pageInfo.totalItems || 0}</div>
          </div>
        ),
      })) ?? [];

  return (
    <WfoSummaryCard
      headerTitle={t('headerTitle')}
      headerValue={productsSummaryResult?.pageInfo.totalItems ?? '-'}

      listTitle={t('listTitle')}
      listItems={listItems}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};
