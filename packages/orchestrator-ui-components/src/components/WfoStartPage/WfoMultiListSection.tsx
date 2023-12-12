import React, { FC } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { PATH_SUBSCRIPTIONS } from '@/components';
import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import {
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCards,
} from '@/components/WfoSummary/WfoSummaryCards';
import { getSubscriptionsListGraphQlQueryForStartPage } from '@/graphqlQueries';
import { useQueryWithGraphql } from '@/hooks';
import { SortOrder } from '@/types';
import { getFirstUuidPart } from '@/utils';

export const WfoMultiListSection: FC = () => {
    // Todo: get data from graphql
    // const favouriteSubscriptionsList = useFavouriteSubscriptions();
    // const processesAttentionList = useProcessesAttention();
    // const completedProcessesList = useRecentProcesses();

    const { data } = useQueryWithGraphql(
        getSubscriptionsListGraphQlQueryForStartPage<SubscriptionListItem>(),
        {
            first: 5,
            after: 0,
            filterBy: [{ field: 'status', value: 'ACTIVE' }],
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        },
        ['subscriptions', 'startPage'],
    );

    const lastSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: 'Total Subscriptions',
        headerValue: data?.subscriptions.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: 'Latest subscriptions',
        listItems:
            data?.subscriptions.page.map((subscription) => ({
                title: subscription.description,
                value: getFirstUuidPart(subscription.subscriptionId),
                url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
            })) ?? [],
        buttonName: 'Show all subscriptions',
        buttonUrl: PATH_SUBSCRIPTIONS,
    };

    return (
        <>
            {/*Todo clean up:*/}
            {/*<EuiFlexGroup wrap>*/}
            {/*    <WfoListStartPage list={favouriteSubscriptionsList} />*/}
            {/*    <WfoListStartPage list={processesAttentionList} />*/}
            {/*    <WfoListStartPage list={completedProcessesList} />*/}
            {/*</EuiFlexGroup>*/}

            <EuiFlexItem>
                <WfoSummaryCards
                    summaryCards={[lastSubscriptionsSummaryCard]}
                />
            </EuiFlexItem>
        </>
    );
};
