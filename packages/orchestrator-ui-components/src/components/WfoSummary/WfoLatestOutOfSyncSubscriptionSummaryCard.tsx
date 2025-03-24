import React from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_SUBSCRIPTIONS,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { mapSubscriptionSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { outOfSyncSubscriptionsListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetSubscriptionSummaryListQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export const WfoLatestOutOfSyncSubscriptionSummaryCard = () => {
    const t = useTranslations('startPage.outOfSyncSubscriptions');

    const {
        data: outOfSyncSubscriptionsSummaryResult,
        isFetching: outOfSyncsubscriptionsSummaryIsFetching,
        isLoading: outOfSyncsubscriptionsSummaryIsLoading,
    } = useGetSubscriptionSummaryListQuery(
        outOfSyncSubscriptionsListSummaryQueryVariables,
    );

    return (
        <WfoSummaryCard
            headerTitle={t('headerTitle')}
            headerValue={
                outOfSyncSubscriptionsSummaryResult?.pageInfo.totalItems ?? 0
            }
            headerStatus={SummaryCardStatus.Error}
            listTitle={t('listTitle')}
            listItems={optionalArrayMapper(
                outOfSyncSubscriptionsSummaryResult?.subscriptions,
                mapSubscriptionSummaryToSummaryCardListItem,
            )}
            button={{
                name: t('buttonText'),
                url: `${PATH_SUBSCRIPTIONS}?activeTab=ALL&sortBy=field-startDate_order-ASC&queryString=status%3A%28provisioning%7Cactive%29+insync%3Afalse`,
            }}
            isLoading={outOfSyncsubscriptionsSummaryIsLoading}
            isFetching={outOfSyncsubscriptionsSummaryIsFetching}
        />
    );
};
