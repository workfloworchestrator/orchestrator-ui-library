import React from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_SUBSCRIPTIONS,
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { mapSubscriptionSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { subscriptionsListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetSubscriptionSummaryListQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export const WfoLatestActiveSubscriptionsSummaryCard = () => {
    const t = useTranslations('startPage.activeSubscriptions');

    const {
        data: subscriptionsSummaryResult,
        isLoading: subscriptionsSummaryIsFetching,
    } = useGetSubscriptionSummaryListQuery(
        subscriptionsListSummaryQueryVariables,
    );

    // Todo make the props inline
    const latestActiveSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: t('headerTitle'),
        headerValue: subscriptionsSummaryResult?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: t('listTitle'),
        listItems: optionalArrayMapper(
            subscriptionsSummaryResult?.subscriptions,
            mapSubscriptionSummaryToSummaryCardListItem,
        ),
        button: {
            name: t('buttonText'),
            url: PATH_SUBSCRIPTIONS,
        },
        isLoading: subscriptionsSummaryIsFetching,
    };

    return <WfoSummaryCard {...latestActiveSubscriptionsSummaryCard} />;
};
