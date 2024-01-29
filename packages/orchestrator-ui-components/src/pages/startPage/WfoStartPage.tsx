import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { PATH_SUBSCRIPTIONS, PATH_TASKS, PATH_WORKFLOWS } from '@/components';
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
import {
    GraphqlQueryVariables,
    Process,
    ProductDefinition,
    SortOrder,
    Subscription,
} from '@/types';
import { formatDate } from '@/utils';

export const WfoStartPage = () => {
    const t = useTranslations('startPage');

    const {
        data: subscriptionsSummaryResult,
        isLoading: subscriptionsSummaryIsFetching,
    } = useQueryWithGraphql(
        getSubscriptionsListSummaryGraphQlQuery(),
        subscriptionsListSummaryQueryVariables,
        ['subscriptions', 'startPage'],
    );
    const {
        data: processesSummaryResult,
        isLoading: processesSummaryIsFetching,
    } = useQueryWithGraphql(
        getProcessListSummaryGraphQlQuery(),
        processListSummaryQueryVariables,
        ['workflows', 'startPage'],
    );
    const {
        data: failedTasksSummaryResult,
        isLoading: failedTasksSummaryIsFetching,
    } = useQueryWithGraphql(
        getProcessListSummaryGraphQlQuery(),
        taskListSummaryQueryVariables,
        ['tasks', 'startPage'],
    );
    const {
        data: productsSummaryResult,
        isLoading: productsSummaryIsFetching,
    } = useQueryWithGraphql(
        getProductsSummaryQuery(),
        productsSummaryQueryVariables,
        'productSummary',
    );

    const latestActiveSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: t('activeSubscriptions.headerTitle'),
        headerValue:
            subscriptionsSummaryResult?.subscriptions.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: t('activeSubscriptions.listTitle'),
        listItems:
            subscriptionsSummaryResult?.subscriptions.page.map(
                (subscription) => ({
                    title: subscription.description,
                    value: formatDate(subscription.startDate),
                    url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
                }),
            ) ?? [],
        button: {
            name: t('activeSubscriptions.buttonText'),
            url: PATH_SUBSCRIPTIONS,
        },
        isLoading: subscriptionsSummaryIsFetching,
    };

    const latestWorkflowsSummaryCard: SummaryCard = {
        headerTitle: t('activeWorkflows.headerTitle'),
        headerValue: processesSummaryResult?.processes.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: t('activeWorkflows.listTitle'),
        listItems:
            processesSummaryResult?.processes.page.map((workflow) => ({
                title: workflow.workflowName,
                value: formatDate(workflow?.startedAt),
                url: `${PATH_WORKFLOWS}/${workflow.processId}`,
            })) ?? [],
        button: {
            name: t('activeWorkflows.buttonText'),
            url: PATH_WORKFLOWS,
        },
        isLoading: processesSummaryIsFetching,
    };

    const failedTasksSummaryCard: SummaryCard = {
        headerTitle: t('failedTasks.headerTitle'),
        headerValue:
            failedTasksSummaryResult?.processes.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Error,
        listTitle: t('failedTasks.listTitle'),
        listItems:
            failedTasksSummaryResult?.processes.page.map((task) => ({
                title: task.workflowName,
                value: formatDate(task?.startedAt),
                url: `${PATH_TASKS}/${task.processId}`,
            })) ?? [],
        button: {
            name: t('failedTasks.buttonText'),
            url: PATH_TASKS,
        },
        isLoading: failedTasksSummaryIsFetching,
    };

    const productsSummaryCard: SummaryCard = {
        headerTitle: t('products.headerTitle'),
        headerValue: productsSummaryResult?.products.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: t('products.listTitle'),
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
                })) ?? [],
        isLoading: productsSummaryIsFetching,
    };

    return (
        <EuiFlexItem>
            <WfoSummaryCards
                summaryCards={[
                    failedTasksSummaryCard,
                    latestWorkflowsSummaryCard,
                    latestActiveSubscriptionsSummaryCard,
                    productsSummaryCard,
                ]}
            />
        </EuiFlexItem>
    );
};

const subscriptionsListSummaryQueryVariables: GraphqlQueryVariables<Subscription> =
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
    };

const processListSummaryQueryVariables: GraphqlQueryVariables<Process> = {
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
            value: 'created-running-suspended-waiting-failed-resumed-inconsistent_data-api_unavailable-awaiting_callback',
        },
    ],
};

const taskListSummaryQueryVariables: GraphqlQueryVariables<Process> = {
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
            value: 'failed-inconsistent_data-api_unavailable',
        },
    ],
};

const productsSummaryQueryVariables: GraphqlQueryVariables<ProductDefinition> =
    {
        first: 1000,
        after: 0,
        sortBy: {
            field: 'name',
            order: SortOrder.ASC,
        },
    };
