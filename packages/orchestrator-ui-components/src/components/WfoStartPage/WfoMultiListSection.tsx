import React, { FC } from 'react';

import { EuiFlexItem } from '@elastic/eui';

import {
    PATH_METADATA_PRODUCTS,
    PATH_SUBSCRIPTIONS,
    PATH_TASKS,
    PATH_WORKFLOWS,
    WfoLoading,
} from '@/components';
import {
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCards,
} from '@/components/WfoSummary/WfoSummaryCards';
import { GET_SUMMARY_GRAPHQL_QUERY } from '@/graphqlQueries/summaryQuery';
import { useQueryWithGraphql } from '@/hooks';
import { getFirstUuidPart } from '@/utils';

export const WfoMultiListSection: FC = () => {
    // Todo: get data from graphql
    // const favouriteSubscriptionsList = useFavouriteSubscriptions();
    // const processesAttentionList = useProcessesAttention();
    // const completedProcessesList = useRecentProcesses();

    const { data } = useQueryWithGraphql(
        GET_SUMMARY_GRAPHQL_QUERY,
        {
            first: 5,
        },
        ['startPage'],
    );

    if (!data) {
        return <WfoLoading />;
    }

    // Todo map to SummaryCard function here
    const latestActiveSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: 'Total Subscriptions',
        headerValue: data.subscriptions.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: 'Latest subscriptions',
        listItems:
            data.subscriptions.page.map((subscription) => ({
                title: subscription.description,
                value: getFirstUuidPart(subscription.subscriptionId),
                url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
            })) ?? [],
        buttonName: 'Show all subscriptions',
        buttonUrl: PATH_SUBSCRIPTIONS,
    };

    const latestWorkflowsSummaryCard: SummaryCard = {
        headerTitle: 'Total Workflows',
        headerValue: data.processes.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: 'Most recent workflows',
        listItems:
            data.processes.page.map((process) => ({
                title: process.workflowName,
                value: process.startedAt,
                url: `${PATH_WORKFLOWS}/${process.processId}`,
            })) ?? [],
        buttonName: 'Show all workflows',
        buttonUrl: PATH_WORKFLOWS,
    };

    const failedTasksSummaryCard: SummaryCard = {
        headerTitle: 'Recently failed tasks',
        headerValue: data.tasks.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Error,
        listTitle: 'Most recent workflows',
        listItems:
            data.tasks.page.map((task) => ({
                title: task.workflowName,
                value: task.startedAt,
                url: `${PATH_TASKS}/${task.processId}`,
            })) ?? [],
        buttonName: 'Show all tasks',
        buttonUrl: PATH_TASKS,
    };

    const productsSummaryCard: SummaryCard = {
        headerTitle: 'Products',
        headerValue: data.products.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: 'Products',
        listItems:
            data.products.page
                .sort(
                    (left, right) =>
                        (right.subscriptions.pageInfo.totalItems ?? 0) -
                        (left.subscriptions.pageInfo.totalItems ?? 0),
                )
                .map((product) => ({
                    title: '',
                    value: (
                        <div
                            css={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>{product.name}</div>
                            <div>
                                {product.subscriptions.pageInfo.totalItems || 0}
                            </div>
                        </div>
                    ),
                    url: `${PATH_METADATA_PRODUCTS}`,
                })) ?? [],
        buttonName: 'Show all products',
        buttonUrl: PATH_METADATA_PRODUCTS,
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
                    summaryCards={[
                        latestActiveSubscriptionsSummaryCard,
                        latestWorkflowsSummaryCard,
                        failedTasksSummaryCard,
                        productsSummaryCard,
                    ]}
                />
            </EuiFlexItem>
        </>
    );
};
