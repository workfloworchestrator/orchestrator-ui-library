import React from 'react';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { START_DATE } from '../../components/Subscriptions/subscriptionsQuery';
import {
    defaultSubscriptionsTabs,
    getSortDirectionFromString,
    getSubscriptionsTabTypeFromString,
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

export default function SubscriptionsPage() {
    const router = useRouter();

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Subscription>({
            sortBy: {
                field: START_DATE,
                order: SortOrder.DESC,
            },
        });
    // Todo: remove this, it got replaced by dataDisplayParams
    // const [pageSize, setPageSize] = useQueryParam(
    //     'pageSize',
    //     withDefault(
    //         NumberParam,
    //         getTableConfigFromLocalStorage(
    //             SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    //         )?.selectedPageSize ??
    //             GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES.first,
    //     ),
    // );
    // const [pageIndex, setPageIndex] = useQueryParam(
    //     'pageIndex',
    //     withDefault(
    //         NumberParam,
    //         GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES.after,
    //     ),
    // );
    // const [sorting, setSorting] = useQueryParam(
    //     'sorting',
    //     withDefault(ObjectParam, {
    //         field: DEFAULT_SORT_FIELD,
    //         direction: DEFAULT_SORT_ORDER.toString(),
    //     }),
    // );
    // const [filterQuery, setFilterQuery] = useQueryParam(
    //     'filter',
    //     withDefault(StringParam, ''),
    // );

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
                pageSize={dataDisplayParams.pageSize}
                setPageSize={(updatedPageSize) =>
                    setDataDisplayParam('pageSize', updatedPageSize)
                }
                pageIndex={dataDisplayParams.pageIndex}
                setPageIndex={(updatedPageIndex) =>
                    setDataDisplayParam('pageIndex', updatedPageIndex)
                }
                sortOrder={{
                    field: dataDisplayParams.sortBy?.field ?? START_DATE,
                    order: sortOrder,
                }}
                setSortOrder={(updatedSortOrder) => {
                    setDataDisplayParam('sortBy', {
                        // Todo fix this type error
                        // @ts-ignore
                        field: updatedSortOrder.field,
                        order: updatedSortOrder.order,
                    });
                }}
                filterQuery={dataDisplayParams.esQueryString ?? ''}
                setFilterQuery={(updatedFilterQuery) =>
                    setDataDisplayParam('esQueryString', updatedFilterQuery)
                }
                alwaysOnFilters={alwaysOnFilters}
            />
        </NoSSR>
    );
}
