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
import { optionalArrayMapper, toOptionalArrayEntry } from '@/utils';

import {
    mapProcessSummaryToSummaryCardListItem,
    mapSubscriptionSummaryToSummaryCardListItem,
} from './mappers';
import {
    activeWorkflowsListSummaryQueryVariables,
    getMyWorkflowListSummaryQueryVariables,
    outOfSyncSubscriptionsListSummaryQueryVariables,
    productsSummaryQueryVariables,
    subscriptionsListSummaryQueryVariables,
    taskListSummaryQueryVariables,
} from './queryVariables';

import { useStartPageSummaryCardConfigurationOverride } from './useStartPageSummaryCardConfigurationOverride';

export const WfoStartPage = () => {
    const t = useTranslations('startPage');
    const { overrideSummaryCards } =
        useStartPageSummaryCardConfigurationOverride();
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
        listItems: optionalArrayMapper(
            subscriptionsSummaryResult?.subscriptions,
            mapSubscriptionSummaryToSummaryCardListItem,
        ),
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
        listItems: optionalArrayMapper(
            outOfSyncSubscriptionsSummaryResult?.subscriptions,
            mapSubscriptionSummaryToSummaryCardListItem,
        ),
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
        listItems: optionalArrayMapper(
            activeWorkflowsSummaryResponse?.processes,
            mapProcessSummaryToSummaryCardListItem,
        ),
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
        listItems: optionalArrayMapper(
            myWorkflowsSummaryResponse?.processes,
            mapProcessSummaryToSummaryCardListItem,
        ),
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
        listItems: optionalArrayMapper(
            failedTasksSummaryResponse?.processes,
            mapProcessSummaryToSummaryCardListItem,
        ),
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

    const allowedSummaryCards = [
        ...toOptionalArrayEntry(myWorkflowsSummaryCard, !!username),
        activeWorkflowsSummaryCard,
        ...toOptionalArrayEntry(
            failedTasksSummaryCard,
            isAllowed(PolicyResource.NAVIGATION_TASKS),
        ),
        latestOutOfSyncSubscriptionsSummaryCard,
        latestActiveSubscriptionsSummaryCard,
        productsSummaryCard,
    ];

    const summaryCards =
        overrideSummaryCards?.(allowedSummaryCards) || allowedSummaryCards;

    return (
        <EuiFlexItem>
            <WfoSummaryCards summaryCards={summaryCards} />
        </EuiFlexItem>
    );
};
