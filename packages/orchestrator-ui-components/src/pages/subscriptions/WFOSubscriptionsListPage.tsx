import React from 'react';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { useDataDisplayParams } from '../../hooks';
import {
    defaultSubscriptionsTabs,
    getSubscriptionsTabTypeFromString,
    SubscriptionListItem,
    WFOSubscriptionsList,
    WFOSubscriptionsTabType,
} from '../../components/WFOSubscriptionsList';
import { SortOrder } from '../../types';
import {
    DEFAULT_PAGE_SIZE,
    getSortDirectionFromString,
    getTableConfigFromLocalStorage,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
} from '../../components/WFOTable';
import { WFOFilterTabs } from '../../components';

export const WFOSubscriptionsListPage = () => {
    const router = useRouter();

    const initialPageSize =
        getTableConfigFromLocalStorage(SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY)
            ?.selectedPageSize ?? DEFAULT_PAGE_SIZE;
    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<SubscriptionListItem>({
            pageSize: initialPageSize,
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
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
};
