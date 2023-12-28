import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Pagination } from '@elastic/eui';

import {
    FilterQuery,
    WfoDateTime,
    WfoInsyncIcon,
    WfoSubscriptionStatusBadge,
} from '@/components';
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
    };

    const { sortBy, queryString } = dataDisplayParams;
    const { data, isError, isLoading } = useQueryWithGraphql(
        getSubscriptionsListGraphQlQuery<SubscriptionListItem>(),
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy,
            filterBy: alwaysOnFilters,
            query: queryString || undefined,
        },
        ['subscriptions', 'listPage'],
    );

    const sortedColumnId = getTypedFieldFromObject(sortBy?.field, tableColumns);
    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    const dataSorting: WfoDataSorting<SubscriptionListItem> = {
        field: sortedColumnId,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };
    const { totalItems, sortFields, filterFields } =
        data?.subscriptions?.pageInfo ?? {};
    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ?? 0,
    };

    const handleCsvDownload = () => {};

    return (
        <WfoTableWithFilter<SubscriptionListItem>
            queryString={dataDisplayParams.queryString}
            onUpdateQueryString={getQueryStringHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            data={
                data
                    ? mapGraphQlSubscriptionsResultToSubscriptionListItems(data)
                    : []
            }
            tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                tableColumns,
                sortFields,
                filterFields,
            )}
            defaultHiddenColumns={hiddenColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isLoading}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            detailModalTitle={'Details - Subscription'}
            onUpdatePage={getPageChangeHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            hasError={isError}
            onDownloadCsv={() => handleCsvDownload()}
        />
    );
};

//todo move out of here to make it reusable
type WfoCsvDownloaderProps = {
    alwaysOnFilters?: FilterQuery<SubscriptionListItem>[];
    dataDisplayParams: DataDisplayParams<SubscriptionListItem>;
};

// A component is used since we are using a hook to fetch the data
// Might be better to split up the hook from the actual data fetching (useQueryWithGraphql.ts)
const WfoCsvDownloader: FC<WfoCsvDownloaderProps> = ({
    alwaysOnFilters,
    dataDisplayParams,
}) => {
    const { data, isLoading } = useQueryWithGraphql(
        getSubscriptionsListGraphQlQuery<SubscriptionListItem>(),
        {
            first: 1000,
            after: 0,
            sortBy: dataDisplayParams.sortBy,
            filterBy: alwaysOnFilters,
            query: dataDisplayParams.queryString || undefined,
        },
        'subscriptions',
    );

    if (isLoading) {
        return <div>Loading CSV...</div>;
    }

    const dataForCsv = data?.subscriptions.page;
    console.log('CSV data', dataForCsv);

    // inspiration https://openjavascript.info/2022/12/18/json-file-to-csv-download-with-vanilla-javascript/
    // Note: Some fields are objects and .toString() doesn't work well on them
    // we need to parse the data just like we do in the table.

    if (dataForCsv) {
        const headers = Object.keys(dataForCsv[0]).toString();
        const rows = dataForCsv.map((row) => Object.values(row).toString());
        const csv = [headers, ...rows].join('\n');

        console.log({ csv });
    }

    return <div>CSV is Ready</div>;
};
