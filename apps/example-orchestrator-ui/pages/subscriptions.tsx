import React from 'react';
import NoSSR from 'react-no-ssr';
import { Subscriptions } from '../components/Subscriptions/Subscriptions';
import {
    BooleanParam,
    NumberParam,
    StringParam,
    useQueryParam,
    withDefault,
} from 'use-query-params';
import {
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
    DEFAULT_SORT_ORDER,
    getSortOrderValue,
    sortOrderIsDescending,
    DEFAULT_SORT_FIELD,
} from '../components/Subscriptions/subscriptionsQuery';

export default function SubscriptionsPage() {
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
    const [sortField, setSortField] = useQueryParam(
        'sortField',
        withDefault(StringParam, DEFAULT_SORT_FIELD),
    );
    const [sortOrder, setSortOrder] = useQueryParam(
        'sortOrderDescending',
        withDefault(BooleanParam, sortOrderIsDescending(DEFAULT_SORT_ORDER)),
    );

    return (
        <NoSSR>
            <Subscriptions
                pageSize={pageSize}
                setPageSize={(updatedPageSize) => setPageSize(updatedPageSize)}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                sortOrder={{
                    field: sortField,
                    order: getSortOrderValue(sortOrder),
                }}
                setSortOrder={(updatedSortOrder) => {
                    setSortField(updatedSortOrder.field);
                    setSortOrder(sortOrderIsDescending(updatedSortOrder.order));
                }}
            />
        </NoSSR>
    );
}
