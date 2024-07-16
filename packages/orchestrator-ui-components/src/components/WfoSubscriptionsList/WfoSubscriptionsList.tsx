import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Pagination } from '@elastic/eui';

import {
    FilterQuery,
    PATH_SUBSCRIPTIONS,
    WfoDateTime,
    WfoInlineJson,
    WfoInsyncIcon,
    WfoJsonCodeBlock,
    WfoSubscriptionStatusBadge,
} from '@/components';
import { DataDisplayParams, useShowToastMessage } from '@/hooks';
import {
    useGetSubscriptionListQuery,
    useLazyGetSubscriptionListQuery,
} from '@/rtk/endpoints/subscriptionList';
import { GraphqlQueryVariables, SortOrder } from '@/types';
import {
    getQueryVariablesForExport,
    getTypedFieldFromObject,
    parseDateToLocaleDateTimeString,
} from '@/utils';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@/utils/csvDownload';

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
    mapGraphQlSubscriptionsResultToPageInfo,
    mapGraphQlSubscriptionsResultToSubscriptionListItems,
} from './subscriptionResultMappers';

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
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

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
        metadata: {
            field: 'metadata',
            name: t('metadata'),
            render: (value) => <WfoInlineJson data={value} />,
            renderDetails: (value) =>
                value && <WfoJsonCodeBlock data={value} isBasicStyle />,
        },
    };

    const { sortBy, queryString, pageIndex, pageSize } = dataDisplayParams;

    const graphqlQueryVariables: GraphqlQueryVariables<SubscriptionListItem> = {
        first: pageSize,
        after: pageIndex * pageSize,
        sortBy,
        filterBy: alwaysOnFilters,
        query: queryString || undefined,
    };

    const { data, isFetching, isLoading, isError } =
        useGetSubscriptionListQuery(graphqlQueryVariables);
    const [getSubscriptionListTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetSubscriptionListQuery();
    const getSubscriptionListForExport = () =>
        getSubscriptionListTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const sortedColumnId = getTypedFieldFromObject(sortBy?.field, tableColumns);
    if (!sortedColumnId) {
        router.replace(PATH_SUBSCRIPTIONS);
        return null;
    }

    const dataSorting: WfoDataSorting<SubscriptionListItem> = {
        field: sortedColumnId,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };
    const { totalItems, sortFields, filterFields } = data?.pageInfo ?? {};
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
            loadingState={{ isLoading, isFetching }}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            detailModalTitle={'Details - Subscription'}
            onUpdatePage={getPageChangeHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            hasError={isError}
            onExportData={csvDownloadHandler(
                getSubscriptionListForExport,
                mapGraphQlSubscriptionsResultToSubscriptionListItems,
                mapGraphQlSubscriptionsResultToPageInfo,
                Object.keys(tableColumns),
                getCsvFileNameWithDate('Subscriptions'),
                showToastMessage,
                tError,
            )}
            exportDataIsLoading={isFetchingCsv}
        />
    );
};
