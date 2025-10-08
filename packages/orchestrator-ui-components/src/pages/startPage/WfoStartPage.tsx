import React, { ReactElement } from 'react';

import { useTranslations } from 'next-intl';

import { EuiPageHeader } from '@elastic/eui';

import {
    WfoActiveWorkflowsSummaryCard,
    WfoFailedTasksSummaryCard,
    WfoLatestActiveSubscriptionsSummaryCard,
    WfoLatestOutOfSyncSubscriptionSummaryCard,
    WfoMyWorkflowsSummaryCard,
    WfoProductsSummaryCard,
    WfoSummaryCards,
} from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { PolicyResource } from '@/configuration';
import { usePolicy, useWfoSession } from '@/hooks';
import { toOptionalArrayEntry } from '@/utils';

import { useStartPageSummaryCardConfigurationOverride } from './useStartPageSummaryCardConfigurationOverride';

export const WfoStartPage = () => {
    const t = useTranslations('main');

    const { overrideSummaryCards } =
        useStartPageSummaryCardConfigurationOverride();

    const { isAllowed } = usePolicy();
    const { session } = useWfoSession();
    const username = session?.user?.name ?? '';

    // The key can be used to filter or sort on when overriding the cards in the app
    const defaultSummaryCards: ReactElement[] = [
        ...toOptionalArrayEntry(
            <WfoMyWorkflowsSummaryCard key="myWorkflows" username={username} />,
            !!username,
        ),
        <WfoActiveWorkflowsSummaryCard key="activeWorkflows" />,
        ...toOptionalArrayEntry(
            <WfoFailedTasksSummaryCard key="failedTasks" />,
            isAllowed(PolicyResource.NAVIGATION_TASKS),
        ),
        <WfoLatestOutOfSyncSubscriptionSummaryCard key="latestOutOfSyncSubscription" />,
        <WfoLatestActiveSubscriptionsSummaryCard key="latestActiveSubscriptions" />,
        <WfoProductsSummaryCard key="products" />,
    ];

    const summaryCards =
        overrideSummaryCards?.(defaultSummaryCards) || defaultSummaryCards;

    return (
        <>
            <WfoContentHeader
                title={
                    <EuiPageHeader pageTitle={`${t('welcome')} ${username}`} />
                }
            />
            <WfoSummaryCards>{summaryCards}</WfoSummaryCards>
        </>
    );
};
