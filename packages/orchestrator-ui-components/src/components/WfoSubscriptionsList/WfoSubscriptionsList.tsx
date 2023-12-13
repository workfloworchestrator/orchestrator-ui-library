import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Pagination } from '@elastic/eui';

import { WfoSubscriptionStatusBadge } from '@/components';
import { FilterQuery, WfoDateTime, WfoLoading } from '@/components';
import { WfoInsyncIcon } from '@/components/WfoInsyncIcon';
import { getSubscriptionsListGraphQlQuery } from '@/graphqlQueries';
import { DataDisplayParams, useQueryWithGraphql } from '@/hooks';
import { SortOrder } from '@/types';
import {
    getTypedFieldFromObject,
    parseDateToLocaleDateTimeString,
} from '@/utils';

import {
    DEFAULT_PAGE_SIZES,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    TableColumnKeys,
    WfoDataSorting,
    WfoTableColumns,
    WfoTableWithFilter,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '../WfoTable';
import { WfoFirstPartUUID } from '../WfoTable/WfoFirstPartUUID';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '../WfoTable/utils/mapSortableAndFilterableValuesToTableColumnConfig';
import {
    SubscriptionListItem,
    mapGraphQlSubscriptionsResultToSubscriptionListItems,
} from './mapGraphQlSubscriptionsResultToSubscriptionListItems';

export type WfoSubscriptionsListProps = {
    alwaysOnFilters?: FilterQuery<SubscriptionListItem>[];
    dataDisplayParams: DataDisplayParams<SubscriptionListItem>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<SubscriptionListItem>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<SubscriptionListItem>[DisplayParamKey],
    ) => void;
    hiddenColumns: TableColumnKeys<SubscriptionListItem> | undefined;
};

export const WfoSubscriptionsList: FC<WfoSubscriptionsListProps> = ({
    alwaysOnFilters,
    dataDisplayParams,
    setDataDisplayParam,
    hiddenColumns,
}) => {
    // TODO: There seems to be a problem showing the product/productName in this list
    // https://github.com/workfloworchestrator/orchestrator-ui/issues/262

    const router = useRouter();
    const t = useTranslations('subscriptions.index');

    const tableColumns: WfoTableColumns<SubscriptionListItem> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        description: {
            field: 'description',
            name: t('description'),
            width: '400',
            render: (value, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: 'status',
            name: t('status'),
            width: '110',
            render: (value) => <WfoSubscriptionStatusBadge status={value} />,
        },
        insync: {
            field: 'insync',
            name: t('insync'),
            width: '110',
            render: (value) => <WfoInsyncIcon inSync={value} />,
        },
        productName: {
            field: 'productName',
            name: t('product'),
        },
        tag: {
            field: 'tag',
            name: t('tag'),
            width: '100',
        },
        startDate: {
            field: 'startDate',
            name: t('startDate'),
            width: '150',
            render: (value) => <WfoDateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
        endDate: {
            field: 'endDate',
            name: t('endDate'),
            width: '150',
            render: (value) => <WfoDateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
        note: {
            field: 'note',
            name: t('note'),
        },
        customerFullname: {
            field: 'customerFullname',
            name: t('customerFullname'),
            width: '150',
        },
        customerShortcode: {
            field: 'customerShortcode',
            name: t('customerShortcode'),
            width: '150',
        },
    };

    const { sortBy, queryString } = dataDisplayParams;
    const { data, isFetching } = useQueryWithGraphql(
        getSubscriptionsListGraphQlQuery<SubscriptionListItem>(),
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy,
            filterBy: alwaysOnFilters,
            query: queryString || undefined,
        },
        'subscriptions',
    );

    const sortedColumnId = getTypedFieldFromObject(sortBy?.field, tableColumns);
    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    if (!data) {
        return <WfoLoading />;
    }

    const dataSorting: WfoDataSorting<SubscriptionListItem> = {
        field: sortedColumnId,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };
    const { totalItems, sortFields, filterFields } =
        data.subscriptions.pageInfo;
    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ?? 0,
    };

    return (
        <WfoTableWithFilter<SubscriptionListItem>
            queryString={dataDisplayParams.queryString}
            onUpdateQueryString={getQueryStringHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            data={mapGraphQlSubscriptionsResultToSubscriptionListItems(data)}
            tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                tableColumns,
                sortFields,
                filterFields,
            )}
            defaultHiddenColumns={hiddenColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            detailModalTitle={'Details - Subscription'}
            onUpdatePage={getPageChangeHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
        />
    );
};
