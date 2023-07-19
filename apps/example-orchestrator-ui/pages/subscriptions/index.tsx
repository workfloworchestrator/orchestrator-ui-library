import React from 'react';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { START_DATE } from '../../components/Subscriptions/subscriptionsQuery';
import {
    DEFAULT_PAGE_SIZE,
    defaultSubscriptionsTabs,
    getSortDirectionFromString,
    getSubscriptionsTabTypeFromString,
    getTableConfigFromLocalStorage,
    SortOrder,
    SubscriptionsTabs,
    SubscriptionsTabType,
    useDataDisplayParams,
} from '@orchestrator-ui/orchestrator-ui-components';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    Subscription,
    Subscriptions,
} from '../../components/Subscriptions/Subscriptions';
import NoSSR from 'react-no-ssr';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';

export default function SubscriptionsPage() {
    const router = useRouter();

    const initialPageSize =
        getTableConfigFromLocalStorage(SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY)
            ?.selectedPageSize ?? DEFAULT_PAGE_SIZE;
    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Subscription>({
            pageSize: initialPageSize,
            sortBy: {
                field: START_DATE,
                order: SortOrder.DESC,
            },
        });

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, SubscriptionsTabType.ACTIVE),
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
        updatedSubscriptionsTab: SubscriptionsTabType,
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

            <SubscriptionsTabs
                tabs={defaultSubscriptionsTabs}
                selectedSubscriptionsTab={selectedSubscriptionsTab}
                onChangeSubscriptionsTab={handleChangeSubscriptionsTab}
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
