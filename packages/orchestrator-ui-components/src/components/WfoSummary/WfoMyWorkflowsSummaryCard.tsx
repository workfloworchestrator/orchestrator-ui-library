import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { PATH_WORKFLOWS } from '@/components';
import {
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components/WfoSummary/WfoSummaryCard';
import { WfoWorkflowsListTabType } from '@/pages';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { getMyWorkflowListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import {
    WfoQueryParams,
    getUrlWithQueryParams,
    optionalArrayMapper,
} from '@/utils';

export type WfoMyWorkflowsSummaryCardProps = {
    username: string;
};

export const WfoMyWorkflowsSummaryCard: FC<WfoMyWorkflowsSummaryCardProps> = ({
    username,
}) => {
    const t = useTranslations('startPage.myWorkflows');

    const {
        data: myWorkflowsSummaryResponse,
        isFetching,
        isLoading,
    } = useGetProcessListSummaryQuery(
        getMyWorkflowListSummaryQueryVariables(username),
    );

    const queryParams = {
        [WfoQueryParams.ACTIVE_TAB]: WfoWorkflowsListTabType.COMPLETED,
        [WfoQueryParams.SORT_BY]: 'field-lastModifiedAt_order-DESC',
        [WfoQueryParams.QUERY_STRING]: `createdBy:"${username}"`,
    };

    return (
        <WfoSummaryCard
            headerTitle={t('headerTitle')}
            headerValue={myWorkflowsSummaryResponse?.pageInfo.totalItems ?? '-'}
            headerStatus={SummaryCardStatus.Success}
            listTitle={t('listTitle')}
            listItems={optionalArrayMapper(
                myWorkflowsSummaryResponse?.processes,
                mapProcessSummaryToSummaryCardListItem,
            )}
            button={{
                name: t('buttonText'),
                url: getUrlWithQueryParams(PATH_WORKFLOWS, queryParams),
            }}
            isLoading={isLoading}
            isFetching={isFetching}
        />
    );
};
