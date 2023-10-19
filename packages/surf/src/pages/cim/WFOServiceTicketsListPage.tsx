import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    DEFAULT_PAGE_SIZE,
    getSortDirectionFromString,
    SortOrder,
    StoredTableConfig,
    useDataDisplayParams,
    useStoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    defaultSubscriptionsTabs,
    getSubscriptionsTabTypeFromString,
    SubscriptionListItem,
    WFOServiceTicketsList,
    WFOSubscriptionsTabType,
} from '../../components';

export const WFOServiceTicketsListPage = () => {
    const router = useRouter();

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<SubscriptionListItem>>();

    const getStoredTableConfig =
        useStoredTableConfig<SubscriptionListItem>('ExampleExample');

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

            <EuiPageHeader pageTitle="Service Tickets" />
            <EuiSpacer size="m" />
            <EuiSpacer size="xxl" />

            <WFOServiceTicketsList
                hiddenColumns={tableDefaults?.hiddenColumns}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
                SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY={'ExampleExample'}
            />
        </>
    );
};
