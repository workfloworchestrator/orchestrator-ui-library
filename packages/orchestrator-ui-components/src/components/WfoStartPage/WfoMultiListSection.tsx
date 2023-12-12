import React, { FC } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { PATH_SUBSCRIPTIONS, PATH_WORKFLOWS } from '@/components';
import { SubscriptionListItem } from '@/components/WfoSubscriptionsList';
import { SummaryCardListItem } from '@/components/WfoSummary/WfoSummaryCardList';
import {
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCards,
} from '@/components/WfoSummary/WfoSummaryCards';
import { getSubscriptionsListGraphQlQueryForStartPage } from '@/graphqlQueries';
import { useQueryWithGraphql } from '@/hooks';

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
        },
        ['subscriptions', 'startPage'],
    );

    console.log('Subscriptions', { data });

    // TEST DATA :
    const summaryListItems: SummaryCardListItem[] = [
        {
            title: 'Item 1',
            value: 'Value 1',
            url: '#',
        },
        {
            title: 'Item 2',
            value: 'Value 2',
            url: '#',
        },
        {
            title: 'Item 3',
            value: 'Value 3',
            url: '#',
        },
        {
            title: 'Item 4',
            value: 'Value 4',
            url: '#',
        },
        {
            title: 'Item 5',
            value: 'Value 5',
            url: '#',
        },
    ];

    const summaryCards: SummaryCard[] = [
        {
            headerTitle: 'Total Subscriptions',
            headerValue: '999',
            headerStatus: SummaryCardStatus.Neutral,
            listTitle: 'Favourite Subscriptions',
            listItems: summaryListItems,
            buttonName: 'Show all subscriptions',
            buttonUrl: PATH_SUBSCRIPTIONS,
        },
        {
            headerTitle: 'Total Subscriptions with a longer title!!!!!',
            headerValue: '999',
            headerStatus: SummaryCardStatus.Neutral,
            listTitle: 'Favourite Subscriptions',
            listItems: [summaryListItems[0]],
            buttonName: 'Show all workflows',
            buttonUrl: PATH_WORKFLOWS,
        },
    ];

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
                    summaryCards={[...summaryCards, ...summaryCards]}
                />
            </EuiFlexItem>
        </>
    );
};
