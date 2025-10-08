import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiSpacer } from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZE,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
} from '@/components';
import type { SubscriptionListItem } from '@/components';
import {
    StoredTableConfig,
    WfoFilterTabs,
    WfoSubscriptionListTab,
    WfoSubscriptionsList,
    WfoTitleWithWebsocketBadge,
    subscriptionListTabs,
} from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { useDataDisplayParams, useStoredTableConfig } from '@/hooks';
import { SortOrder } from '@/types';

export const WfoSubscriptionsListPage = () => {
    const t = useTranslations('subscriptions.detail');

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<SubscriptionListItem>>();

    const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(
        SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<SubscriptionListItem>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        });

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoSubscriptionListTab.ACTIVE),
    );

    const selectedTab = ((): WfoSubscriptionListTab => {
        return (
            subscriptionListTabs.find(({ id }) => id === activeTab)?.id ||
            WfoSubscriptionListTab.ACTIVE
        );
    })();

    const handleChangeSubscriptionsTab = (
        updatedSubscriptionsTab: WfoSubscriptionListTab,
    ) => {
        setActiveTab(updatedSubscriptionsTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = subscriptionListTabs.find(
        ({ id }) => id === activeTab,
    )?.alwaysOnFilters;

    return (
        <>
            <WfoContentHeader
                title={<WfoTitleWithWebsocketBadge title={t('title')} />}
            />

            <WfoFilterTabs
                tabs={subscriptionListTabs}
                selectedTab={selectedTab}
                translationNamespace="subscriptions.tabs"
                onChangeTab={handleChangeSubscriptionsTab}
            />
            <EuiSpacer size="xxl" />

            <WfoSubscriptionsList
                hiddenColumns={tableDefaults?.hiddenColumns}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
};
