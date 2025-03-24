import React from 'react';

import { useTranslations } from 'next-intl';

import {
    SummaryCardListItem,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { productsSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProductsSummaryQuery } from '@/rtk';

export const WfoProductsSummaryCard = () => {
    const t = useTranslations('startPage.products');

    const {
        data: productsSummaryResult,
        isFetching: productsSummaryIsFetching,
        isLoading: productsSummaryIsLoading,
    } = useGetProductsSummaryQuery(productsSummaryQueryVariables);

    const listItems: SummaryCardListItem[] =
        [...(productsSummaryResult?.products ?? [])]
            .sort(
                (left, right) =>
                    (right.subscriptions.pageInfo.totalItems ?? 0) -
                    (left.subscriptions.pageInfo.totalItems ?? 0),
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
                        <div>
                            {product.subscriptions.pageInfo.totalItems || 0}
                        </div>
                    </div>
                ),
            })) ?? [];

    return (
        <WfoSummaryCard
            headerTitle={t('headerTitle')}
            headerValue={productsSummaryResult?.pageInfo.totalItems ?? 0}
            headerStatus={SummaryCardStatus.Neutral}
            listTitle={t('listTitle')}
            listItems={listItems}
            isLoading={productsSummaryIsLoading}
            isFetching={productsSummaryIsFetching}
        />
    );
};
