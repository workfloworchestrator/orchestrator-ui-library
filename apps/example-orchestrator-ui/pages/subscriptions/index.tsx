import React from 'react';
import { useRouter } from 'next/router';
import {
    NumberParam,
    ObjectParam,
    StringParam,
    useQueryParam,
    withDefault,
} from 'use-query-params';
import {
    DEFAULT_SORT_FIELD,
    DEFAULT_SORT_ORDER,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
} from '../../components/SubscriptionsPage/Subscriptions/subscriptionQuery';
import { getSortDirectionFromString } from '@orchestrator-ui/orchestrator-ui-components';
import { EuiPageHeader, EuiSpacer, EuiTab, EuiTabs } from '@elastic/eui';
import { Subscriptions } from '../../components/SubscriptionsPage/Subscriptions/Subscriptions';
import NoSSR from 'react-no-ssr';

export enum SubscriptionsTabType {
    ACTIVE = 'ACTIVE',
    TERMINATED = 'TERMINATED',
    TRANSIENT = 'TRANSIENT',
    ALL = 'ALL',
}

export type SubscriptionsTab = {
    id: SubscriptionsTabType;
    name: string;
    alwaysOnFilter?: [string, string];
};

const tabs: SubscriptionsTab[] = [
    {
        id: SubscriptionsTabType.ACTIVE,
        name: 'Active',
        alwaysOnFilter: ['status', 'active'],
    },
    {
        id: SubscriptionsTabType.TERMINATED,
        name: 'Terminated',
        alwaysOnFilter: ['status', 'terminated'],
    },
    {
        id: SubscriptionsTabType.TRANSIENT,
        name: 'Transient',
        alwaysOnFilter: ['status', 'initial-provisioning-migrating'],
    },
    {
        id: SubscriptionsTabType.ALL,
        name: 'All',
    },
];

export default function SubscriptionsPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, SubscriptionsTabType.ACTIVE),
    );
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
    const selectedSubscriptionsTab =
        getSubscriptionsTabTypeFromString(activeTab);

    if (!sortOrder || !selectedSubscriptionsTab) {
        router.replace('/subscriptions');
        return null;
    }

    return (
        <NoSSR>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Subscriptions" />
            <EuiSpacer size="m" />

            <EuiTabs>
                {tabs.map(({ id, name }) => (
                    <EuiTab
                        key={id}
                        isSelected={id === selectedSubscriptionsTab}
                        onClick={() => {
                            if (id !== selectedSubscriptionsTab) {
                                setActiveTab(id);
                                setPageIndex(0);
                            }
                        }}
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
                alwaysOnFilter={
                    tabs.find((t) => t.id === selectedSubscriptionsTab)
                        ?.alwaysOnFilter
                }
            />
        </NoSSR>
    );
}

export const getSubscriptionsTabTypeFromString = (
    tabId?: string,
): SubscriptionsTabType | undefined => {
    if (!tabId) {
        return undefined;
    }

    switch (tabId.toUpperCase()) {
        case SubscriptionsTabType.ACTIVE.toString():
            return SubscriptionsTabType.ACTIVE;
        case SubscriptionsTabType.TERMINATED.toString():
            return SubscriptionsTabType.TERMINATED;
        case SubscriptionsTabType.TRANSIENT.toString():
            return SubscriptionsTabType.TRANSIENT;
        case SubscriptionsTabType.ALL.toString():
            return SubscriptionsTabType.ALL;

        default:
            return undefined;
    }
};
