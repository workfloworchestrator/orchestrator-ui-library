import React from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_WORKFLOWS,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { activeWorkflowsListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export const WfoActiveWorkflowsSummaryCard = () => {
    const t = useTranslations('startPage.activeWorkflows');

    const {
        data: activeWorkflowsSummaryResponse,
        isFetching: activeWorkflowsSummaryIsFetching,
        isLoading: activeWorkflowsSummaryIsLoading,
    } = useGetProcessListSummaryQuery(activeWorkflowsListSummaryQueryVariables);

    return (
        <WfoSummaryCard
            headerTitle={t('headerTitle')}
            headerValue={
                activeWorkflowsSummaryResponse?.pageInfo.totalItems ?? 0
            }
            headerStatus={SummaryCardStatus.Success}
            listTitle={t('listTitle')}
            listItems={optionalArrayMapper(
                activeWorkflowsSummaryResponse?.processes,
                mapProcessSummaryToSummaryCardListItem,
            )}
            button={{ name: t('buttonText'), url: PATH_WORKFLOWS }}
            isLoading={activeWorkflowsSummaryIsLoading}
            isFetching={activeWorkflowsSummaryIsFetching}
        />
    );
};
