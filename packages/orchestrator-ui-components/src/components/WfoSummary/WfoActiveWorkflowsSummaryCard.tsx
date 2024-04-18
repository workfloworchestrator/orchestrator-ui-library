import React from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_WORKFLOWS,
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { activeWorkflowsListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export const WfoLatestActiveSubscriptionsSummaryCard = () => {
    const t = useTranslations('startPage.activeWorkflows');

    const {
        data: activeWorkflowsSummaryResponse,
        isFetching: activeWorkflowsSummaryIsFetching,
    } = useGetProcessListSummaryQuery(activeWorkflowsListSummaryQueryVariables);

    // Todo make the props inline
    const activeWorkflowsSummaryCard: SummaryCard = {
        headerTitle: t('headerTitle'),
        headerValue: activeWorkflowsSummaryResponse?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: t('listTitle'),
        listItems: optionalArrayMapper(
            activeWorkflowsSummaryResponse?.processes,
            mapProcessSummaryToSummaryCardListItem,
        ),
        button: {
            name: t('buttonText'),
            url: PATH_WORKFLOWS,
        },
        isLoading: activeWorkflowsSummaryIsFetching,
    };

    return <WfoSummaryCard {...activeWorkflowsSummaryCard} />;
};
