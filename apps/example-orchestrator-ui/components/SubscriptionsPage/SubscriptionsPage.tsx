import React, { FC } from 'react';
import { useRouter } from 'next/router';
import {
    NumberParam,
    ObjectParam,
    StringParam,
    useQueryParam,
    withDefault,
} from 'use-query-params';
import { getSortDirectionFromString } from '@orchestrator-ui/orchestrator-ui-components';
import NoSSR from 'react-no-ssr';
import { EuiPageHeader, EuiSpacer, EuiTab, EuiTabs } from '@elastic/eui';
import { Subscriptions } from './Subscriptions/Subscriptions';
import {
    DEFAULT_SORT_FIELD,
    DEFAULT_SORT_ORDER,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
} from './Subscriptions/subscriptionQuery';

export type SubscriptionsOverviewPageProps = {
    alwaysOnFilter?: [string, string];
    activeTab?: string;
};

export const SubscriptionsOverviewPage: FC<SubscriptionsOverviewPageProps> = ({
    alwaysOnFilter,
    activeTab = 'active',
}) => {
    const router = useRouter();

    const [pageSize, setPageSize] = useQueryParam(
        'pageSize',
        withDefault(
            NumberParam,
            GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES.first,
        ),
    );
    const [pageIndex, setPageIndex] = useQueryParam(
        'pageIndex',
        withDefault(
            NumberParam,
            GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES.after,
        ),
    );
    const [sorting, setSorting] = useQueryParam(
        'sorting',
        withDefault(ObjectParam, {
            field: DEFAULT_SORT_FIELD,
            direction: DEFAULT_SORT_ORDER.toString(),
        }),
    );

    const [filterQuery, setFilterQuery] = useQueryParam(
        'filter',
        withDefault(StringParam, ''),
    );

    const sortOrder = getSortDirectionFromString(sorting.direction);
    if (!sortOrder) {
        router.replace('/subscriptions');
        return null;
    }

    const tabs = [
        {
            id: 'active',
            name: 'Active',
            route: '/subscriptions/active',
        },
        {
            id: 'non-active',
            name: 'Initial, provisioning and terminated',
            route: '/subscriptions/non-active',
        },
    ];

    return (
        <NoSSR>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Subscriptions" />
            <EuiSpacer size="m" />

            <EuiTabs>
                {tabs.map(({ id, name, route }) => (
                    <EuiTab
                        key={id}
                        isSelected={id === activeTab}
                        onClick={() => id !== activeTab && router.push(route)}
                    >
                        {name}
                    </EuiTab>
                ))}
            </EuiTabs>
            <EuiSpacer size={'xxl'} />

            <Subscriptions
                pageSize={pageSize}
                setPageSize={(updatedPageSize) => setPageSize(updatedPageSize)}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                sortOrder={{
                    field: sorting.field ?? DEFAULT_SORT_FIELD,
                    order: sortOrder,
                }}
                setSortOrder={(updatedSortOrder) => {
                    setSorting({
                        field: updatedSortOrder.field,
                        direction: updatedSortOrder.order,
                    });
                }}
                filterQuery={filterQuery}
                setFilterQuery={setFilterQuery}
                alwaysOnFilter={alwaysOnFilter}
            />
        </NoSSR>
    );
};
