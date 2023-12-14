import React from 'react';

import { EuiFlexItem } from '@elastic/eui';

import {
    PATH_METADATA_PRODUCTS,
    PATH_SUBSCRIPTIONS,
    PATH_TASKS,
    PATH_WORKFLOWS,
} from '@/components';
import {
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCards,
} from '@/components/WfoSummary/WfoSummaryCards';
import {
    getProductsSummaryQuery,
    getSubscriptionsListSummaryGraphQlQuery,
} from '@/graphqlQueries';
import { getProcessListSummaryGraphQlQuery } from '@/graphqlQueries/processListQuery';
import { useQueryWithGraphql } from '@/hooks';
import { SortOrder } from '@/types';
import { getFirstUuidPart } from '@/utils';

export const WfoStartPage = () => {
    const { data: subscriptionsSummaryResult } = useQueryWithGraphql(
        getSubscriptionsListSummaryGraphQlQuery(),
        {
            first: 5,
            after: 0,
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
            filterBy: [
                {
                    field: 'status',
                    value: 'Active',
                },
            ],
        },
        ['subscriptions', 'startPage'],
    );
    const { data: processesSummaryResult } = useQueryWithGraphql(
        getProcessListSummaryGraphQlQuery(),
        {
            first: 5,
            after: 0,
            sortBy: {
                field: 'startedAt',
                order: SortOrder.DESC,
            },
            filterBy: [
                {
                    // Todo: isTask is not a key of Process
                    // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
                    // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore waiting for fix in backend
                    field: 'isTask',
                    value: 'false',
                },
                {
                    field: 'lastStatus',
                    value: 'created-running-suspended-waiting-failed-resumed',
                },
            ],
        },
        ['processes', 'startPage'],
    );
    const { data: failedTasksSummaryResult } = useQueryWithGraphql(
        getProcessListSummaryGraphQlQuery(),
        {
            first: 5,
            after: 0,
            sortBy: {
                field: 'startedAt',
                order: SortOrder.DESC,
            },
            filterBy: [
                {
                    // Todo: isTask is not a key of Process
                    // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
                    // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore waiting for fix in backend
                    field: 'isTask',
                    value: 'true',
                },
                {
                    field: 'lastStatus',
                    value: 'failed',
                },
            ],
        },
        ['processes', 'startPage'],
    );
    const { data: productsSummaryResult } = useQueryWithGraphql(
        getProductsSummaryQuery(),
        {
            first: 1000,
            after: 0,
            sortBy: {
                field: 'name',
                order: SortOrder.ASC,
            },
        },
        'productSummary',
    );

    // Todo map to SummaryCard function here
    const latestActiveSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: 'Total Subscriptions',
        headerValue:
            subscriptionsSummaryResult?.subscriptions.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: 'Latest subscriptions',
        listItems:
            subscriptionsSummaryResult?.subscriptions.page.map(
                (subscription) => ({
                    title: subscription.description,
                    value: getFirstUuidPart(subscription.subscriptionId),
                    url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
                }),
            ) ?? [],
        buttonName: 'Show all subscriptions',
        buttonUrl: PATH_SUBSCRIPTIONS,
    };

    const latestWorkflowsSummaryCard: SummaryCard = {
        headerTitle: 'Total Workflows',
        headerValue: processesSummaryResult?.processes.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: 'Most recent workflows',
        listItems:
            processesSummaryResult?.processes.page.map((workflow) => ({
                title: workflow.workflowName,
                value: workflow.startedAt,
                url: `${PATH_WORKFLOWS}/${workflow.processId}`,
            })) ?? [],
        buttonName: 'Show all workflows',
        buttonUrl: PATH_WORKFLOWS,
    };

    const failedTasksSummaryCard: SummaryCard = {
        headerTitle: 'Recently failed tasks',
        headerValue:
            failedTasksSummaryResult?.processes.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Error,
        listTitle: 'Most recent workflows',
        listItems:
            failedTasksSummaryResult?.processes.page.map((task) => ({
                title: task.workflowName,
                value: task.startedAt,
                url: `${PATH_TASKS}/${task.processId}`,
            })) ?? [],
        buttonName: 'Show all tasks',
        buttonUrl: PATH_TASKS,
    };
    const productsSummaryCard: SummaryCard = {
        headerTitle: 'Products',
        headerValue: productsSummaryResult?.products.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: 'Products',
        listItems:
            productsSummaryResult?.products.page
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
    );
};
