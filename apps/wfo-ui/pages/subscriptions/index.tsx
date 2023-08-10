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
    WFOSubscriptionsTabs,
    WFOSubscriptionsTabType,
    useDataDisplayParams,
} from '@orchestrator-ui/orchestrator-ui-components';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    Subscription,
    Subscriptions,
} from '../../components/Subscriptions/Subscriptions';
import NoSSR from 'react-no-ssr';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';
import {
    useToastMessage,
    ToastTypes,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function SubscriptionsPage() {
    const toastMessage = useToastMessage();
    const router = useRouter();
    let initialPageSize = DEFAULT_PAGE_SIZE;

    try {
        initialPageSize =
            getTableConfigFromLocalStorage(
                SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
            )?.selectedPageSize || initialPageSize;
    } catch {
        toastMessage.addToast(ToastTypes.ERROR, 'TEXT', 'TITLE');
    }

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

            <WFOSubscriptionsTabs
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
