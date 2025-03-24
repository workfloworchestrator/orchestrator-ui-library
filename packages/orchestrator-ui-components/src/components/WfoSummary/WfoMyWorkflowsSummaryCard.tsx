import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { PATH_WORKFLOWS } from '@/components';
import {
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components/WfoSummary/WfoSummaryCard';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { getMyWorkflowListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

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
                url: `${PATH_WORKFLOWS}?activeTab=COMPLETED&sortBy=field-lastModifiedAt_order-DESC&queryString=createdBy%3A${username}`,
            }}
            isLoading={isLoading}
            isFetching={isFetching}
        />
    );
};
