import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';

import { PATH_SUBSCRIPTIONS, PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import {
    SummaryCard,
    SummaryCardStatus,
    WfoSummaryCards,
} from '@/components/WfoSummary/WfoSummaryCards';
import { PolicyResource } from '@/configuration';
import { usePolicy, useWfoSession } from '@/hooks';
import {
    useGetProcessListSummaryQuery,
    useGetProductsSummaryQuery,
} from '@/rtk';
import { useGetSubscriptionSummaryListQuery } from '@/rtk/endpoints/subscriptionListSummary';
import {
    GraphqlQueryVariables,
    Process,
    ProductsSummary,
    SortOrder,
    Subscription,
} from '@/types';
import { formatDate } from '@/utils';

export const WfoStartPage = () => {
    const t = useTranslations('startPage');
    const { isAllowed } = usePolicy();
    const { session } = useWfoSession();
    const username = session?.user?.name ?? '';

    const {
        data: subscriptionsSummaryResult,
        isLoading: subscriptionsSummaryIsFetching,
    } = useGetSubscriptionSummaryListQuery(
        subscriptionsListSummaryQueryVariables,
    );
    const {
        data: outOfSyncSubscriptionsSummaryResult,
        isLoading: outOfSyncsubscriptionsSummaryIsFetching,
    } = useGetSubscriptionSummaryListQuery(
        outOfSyncSubscriptionsListSummaryQueryVariables,
    );
    const {
        data: activeWorkflowsSummaryResponse,
        isFetching: activeWorkflowsSummaryIsFetching,
    } = useGetProcessListSummaryQuery(activeWorkflowsListSummaryQueryVariables);

    const {
        data: myWorkflowsSummaryResponse,
        isFetching: myWorkflowsSummaryIsFetching,
    } = useGetProcessListSummaryQuery(
        getMyWorkflowListSummaryQueryVariables(username),
    );

    const {
        data: failedTasksSummaryResponse,
        isFetching: failedTasksSummaryIsFetching,
    } = useGetProcessListSummaryQuery(taskListSummaryQueryVariables);

    const {
        data: productsSummaryResult,
        isLoading: productsSummaryIsFetching,
    } = useGetProductsSummaryQuery(productsSummaryQueryVariables);

    const latestActiveSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: t('activeSubscriptions.headerTitle'),
        headerValue: subscriptionsSummaryResult?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: t('activeSubscriptions.listTitle'),
        listItems:
            subscriptionsSummaryResult?.subscriptions.map((subscription) => ({
                title: subscription.description,
                value: formatDate(subscription.startDate),
                url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
            })) ?? [],
        button: {
            name: t('activeSubscriptions.buttonText'),
            url: PATH_SUBSCRIPTIONS,
        },
        isLoading: subscriptionsSummaryIsFetching,
    };

    const latestOutOfSyncSubscriptionsSummaryCard: SummaryCard = {
        headerTitle: t('outOfSyncSubscriptions.headerTitle'),
        headerValue:
            outOfSyncSubscriptionsSummaryResult?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Error,
        listTitle: t('outOfSyncSubscriptions.listTitle'),
        listItems:
            outOfSyncSubscriptionsSummaryResult?.subscriptions.map(
                (subscription) => ({
                    title: subscription.description,
                    value: formatDate(subscription.startDate),
                    url: `${PATH_SUBSCRIPTIONS}/${subscription.subscriptionId}`,
                }),
            ) ?? [],
        button: {
            name: t('outOfSyncSubscriptions.buttonText'),
            url: `${PATH_SUBSCRIPTIONS}?activeTab=ALL&sortBy=field-startDate_order-ASC&queryString=status%3A%28provisioning%7Cactive%29+insync%3Afalse`,
        },
        isLoading: outOfSyncsubscriptionsSummaryIsFetching,
    };

    const activeWorkflowsSummaryCard: SummaryCard = {
        headerTitle: t('activeWorkflows.headerTitle'),
        headerValue: activeWorkflowsSummaryResponse?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: t('activeWorkflows.listTitle'),
        listItems:
            activeWorkflowsSummaryResponse?.processes.map((workflow) => ({
                title: workflow.workflowName,
                value: formatDate(workflow?.startedAt),
                url: `${PATH_WORKFLOWS}/${workflow.processId}`,
            })) ?? [],
        button: {
            name: t('activeWorkflows.buttonText'),
            url: PATH_WORKFLOWS,
        },
        isLoading: activeWorkflowsSummaryIsFetching,
    };

    const myWorkflowsSummaryCard: SummaryCard = {
        headerTitle: t('myWorkflows.headerTitle'),
        headerValue: myWorkflowsSummaryResponse?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Success,
        listTitle: t('myWorkflows.listTitle'),
        listItems:
            myWorkflowsSummaryResponse?.processes.map((workflow) => ({
                title: workflow.workflowName,
                value: formatDate(workflow?.startedAt),
                url: `${PATH_WORKFLOWS}/${workflow.processId}`,
            })) ?? [],
        button: username
            ? {
                  name: t('myWorkflows.buttonText'),
                  url: `${PATH_WORKFLOWS}?activeTab=COMPLETED&sortBy=field-lastModifiedAt_order-DESC&queryString=createdBy%3A${username}`,
              }
            : undefined,
        isLoading: myWorkflowsSummaryIsFetching,
    };

    const failedTasksSummaryCard: SummaryCard = {
        headerTitle: t('failedTasks.headerTitle'),
        headerValue: failedTasksSummaryResponse?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Error,
        listTitle: t('failedTasks.listTitle'),
        listItems:
            failedTasksSummaryResponse?.processes.map((task) => ({
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
        headerValue: productsSummaryResult?.pageInfo.totalItems ?? 0,
        headerStatus: SummaryCardStatus.Neutral,
        listTitle: t('products.listTitle'),
        listItems:
            [...(productsSummaryResult?.products ?? [])]
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

    function getFailedTasksSummarycard() {
        return isAllowed(PolicyResource.NAVIGATION_TASKS)
            ? [failedTasksSummaryCard]
            : [];
    }

    const allowedSummaryCards = [
        myWorkflowsSummaryCard,
        activeWorkflowsSummaryCard,
        ...getFailedTasksSummarycard(),
        latestOutOfSyncSubscriptionsSummaryCard,
        latestActiveSubscriptionsSummaryCard,
        productsSummaryCard,
    ];

    return (
        <EuiFlexItem>
            <WfoSummaryCards summaryCards={allowedSummaryCards} />
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

const outOfSyncSubscriptionsListSummaryQueryVariables: GraphqlQueryVariables<Subscription> =
    {
        first: 5,
        after: 0,
        sortBy: {
            field: 'startDate',
            order: SortOrder.ASC,
        },
        query: 'insync:false',
        filterBy: [
            {
                field: 'status',
                value: 'Active-Provisioning',
            },
        ],
    };

const getMyWorkflowListSummaryQueryVariables = (
    username: string,
): GraphqlQueryVariables<Process> => {
    return {
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
                field: 'createdBy',
                value: username,
            },
        ],
    };
};

const activeWorkflowsListSummaryQueryVariables: GraphqlQueryVariables<Process> =
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

const productsSummaryQueryVariables: GraphqlQueryVariables<ProductsSummary> = {
    first: 1000,
    after: 0,
    sortBy: {
        field: 'name',
        order: SortOrder.ASC,
    },
};
