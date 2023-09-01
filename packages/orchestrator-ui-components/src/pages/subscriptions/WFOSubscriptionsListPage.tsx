import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { useDataDisplayParams, useStoredTableConfig } from '../../hooks';
import {
    defaultSubscriptionsTabs,
    getSubscriptionsTabTypeFromString,
    SubscriptionListItem,
    WFOSubscriptionsList,
    WFOSubscriptionsTabType,
} from '../../components/WFOSubscriptionsList';
import { SortOrder } from '../../types';

import { StoredTableConfig } from '../../components/WFOTable';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../components/WFOTable';
import {
    DEFAULT_PAGE_SIZE,
    getSortDirectionFromString,
} from '../../components/WFOTable';
import { WFOFilterTabs } from '../../components';

export const WFOSubscriptionsListPage = () => {
    const router = useRouter();

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
        withDefault(StringParam, WFOSubscriptionsTabType.ACTIVE),
    );

    const sortOrder = getSortDirectionFromString(
        dataDisplayParams.sortBy?.order,
    );
    const selectedSubscriptionsTab =
        getSubscriptionsTabTypeFromString(activeTab);
    if (!sortOrder || !selectedSubscriptionsTab) {
        router.replace('/subscriptions');
        return null;
    }

    const handleChangeSubscriptionsTab = (
        updatedSubscriptionsTab: WFOSubscriptionsTabType,
    ) => {
        setActiveTab(updatedSubscriptionsTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultSubscriptionsTabs.find(
        ({ id }) => id === selectedSubscriptionsTab,
    )?.alwaysOnFilters;

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Subscriptions" />
            <EuiSpacer size="m" />

            <WFOFilterTabs
                tabs={defaultSubscriptionsTabs}
                selectedTab={selectedSubscriptionsTab}
                translationNamespace="subscriptions.tabs"
                onChangeTab={handleChangeSubscriptionsTab}
            />
            <EuiSpacer size="xxl" />

            <WFOSubscriptionsList
                hiddenColumns={tableDefaults?.hiddenColumns}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
};
