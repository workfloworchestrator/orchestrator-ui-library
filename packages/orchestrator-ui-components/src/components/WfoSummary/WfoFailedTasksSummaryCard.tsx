import React from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_TASKS,
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { taskListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export const WfoLatestActiveSubscriptionsSummaryCard = () => {
    const t = useTranslations('startPage.failedTasks');

    const {
        data: failedTasksSummaryResponse,
        isFetching: failedTasksSummaryIsFetching,
    } = useGetProcessListSummaryQuery(taskListSummaryQueryVariables);

    const failedTasksSummaryCard: SummaryCard = {
        headerTitle: t('headerTitle'),
        headerValue: failedTasksSummaryResponse?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Error,
        listTitle: t('listTitle'),
        listItems: optionalArrayMapper(
            failedTasksSummaryResponse?.processes,
            mapProcessSummaryToSummaryCardListItem,
        ),
        button: {
            name: t('buttonText'),
            url: PATH_TASKS,
        },
        isLoading: failedTasksSummaryIsFetching,
    };

    return <WfoSummaryCard {...failedTasksSummaryCard} />;
};
