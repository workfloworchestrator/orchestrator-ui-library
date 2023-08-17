import React from 'react';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import {
    DEFAULT_PAGE_SIZE,
    getSortDirectionFromString,
    getSubscriptionsTabTypeFromString,
    getTableConfigFromLocalStorage,
    SortOrder,
    WFOFilterTabs,
    useDataDisplayParams,
    defaultSubscriptionsTabs,
    SubscriptionListItem,
    WFOSubscriptionsTabType,
} from '@orchestrator-ui/orchestrator-ui-components';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { Subscriptions } from '../../components/Subscriptions/Subscriptions';
import NoSSR from 'react-no-ssr';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';

export default function SubscriptionsPage() {
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
        <NoSSR>
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

            <Subscriptions
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
            />
        </NoSSR>
    );
}
