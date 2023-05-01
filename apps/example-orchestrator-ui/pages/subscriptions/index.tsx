import React from 'react';
import NoSSR from 'react-no-ssr';
import { Subscriptions } from '../../components/Subscriptions/Subscriptions';
import {
    NumberParam,
    ObjectParam,
    useQueryParam,
    withDefault,
} from 'use-query-params';
import {
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
    DEFAULT_SORT_ORDER,
    DEFAULT_SORT_FIELD,
    getPythiaSortOrderFromString,
} from '../../components/Subscriptions/subscriptionsQuery';
import { useRouter } from 'next/router';

export default function SubscriptionsPage() {
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

    const sortOrder = getPythiaSortOrderFromString(sorting.direction);
    if (!sortOrder) {
        router.replace('/subscriptions');
    }

    return (
        <NoSSR>
            <Subscriptions
                pageSize={pageSize}
                setPageSize={(updatedPageSize) => setPageSize(updatedPageSize)}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                sortOrder={{
                    field: sorting.field,
                    order: sortOrder,
                }}
                setSortOrder={(updatedSortOrder) => {
                    setSorting({
                        field: updatedSortOrder.field,
                        direction: updatedSortOrder.order,
                    });
                }}
            />
        </NoSSR>
    );
}
