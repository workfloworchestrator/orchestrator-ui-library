import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_WORKFLOWS,
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCard,
} from '@/components';
import { mapProcessSummaryToSummaryCardListItem } from '@/pages/startPage/mappers';
import { getMyWorkflowListSummaryQueryVariables } from '@/pages/startPage/queryVariables';
import { useGetProcessListSummaryQuery } from '@/rtk';
import { optionalArrayMapper } from '@/utils';

export type WfoMyWorkflowsSummaryCardProps = {
    username: string;
};

export const WfoLatestActiveSubscriptionsSummaryCard: FC<
    WfoMyWorkflowsSummaryCardProps
> = ({ username }) => {
    const t = useTranslations('startPage.myWorkflows');

    const {
        data: myWorkflowsSummaryResponse,
        isFetching: myWorkflowsSummaryIsFetching,
    } = useGetProcessListSummaryQuery(
        getMyWorkflowListSummaryQueryVariables(username),
    );

    // Todo make the props inline
    const myWorkflowsSummaryCard: SummaryCard = {
        headerTitle: t('headerTitle'),
        headerValue: myWorkflowsSummaryResponse?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: t('listTitle'),
        listItems: optionalArrayMapper(
            myWorkflowsSummaryResponse?.processes,
            mapProcessSummaryToSummaryCardListItem,
        ),
        // Todo: see if this works
        // button: username
        //     ? {
        //           name: t('myWorkflows.buttonText'),
        //           url: `${PATH_WORKFLOWS}?activeTab=COMPLETED&sortBy=field-lastModifiedAt_order-DESC&queryString=createdBy%3A${username}`,
        //       }
        //     : undefined,
        button: {
            name: t('buttonText'),
            url: `${PATH_WORKFLOWS}?activeTab=COMPLETED&sortBy=field-lastModifiedAt_order-DESC&queryString=createdBy%3A${username}`,
        },
        isLoading: myWorkflowsSummaryIsFetching,
    };

    return <WfoSummaryCard {...myWorkflowsSummaryCard} />;
};
