import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    FilterQuery,
    PATH_SUBSCRIPTIONS,
    WfoDateTime,
    WfoInlineJson,
    WfoInsyncIcon,
    WfoJsonCodeBlock,
    WfoSubscriptionStatusBadge,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { DataDisplayParams, useShowToastMessage } from '@/hooks';
import {
    useGetSubscriptionListQuery,
    useLazyGetSubscriptionListQuery,
} from '@/rtk/endpoints/subscriptionList';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
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
    WfoFirstPartUUID,
    getDataSortHandler,
    getQueryStringHandler,
} from '../WfoTable';
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
    const router = useRouter();
    const t = useTranslations('subscriptions.index');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const tableColumnConfig: WfoAdvancedTableColumnConfig<SubscriptionListItem> =
        {
            subscriptionId: {
                columnType: ColumnType.DATA,
                label: t('id'),
                renderData: (value) => <WfoFirstPartUUID UUID={value} />,
                renderDetails: (value) => value,
            },
            description: {
                columnType: ColumnType.DATA,
                label: t('description'),
                width: '400px',
                renderData: (value, record) => (
                    <Link href={`/subscriptions/${record.subscriptionId}`}>
                        {value}
                    </Link>
                ),
            },
            status: {
                columnType: ColumnType.DATA,
                label: t('status'),
                renderData: (value) => (
                    <WfoSubscriptionStatusBadge status={value} />
                ),
            },
            insync: {
                columnType: ColumnType.DATA,
                label: t('insync'),
                renderData: (value) => <WfoInsyncIcon inSync={value} />,
            },
            productName: {
                columnType: ColumnType.DATA,
                label: t('product'),
            },
            tag: {
                columnType: ColumnType.DATA,
                label: t('tag'),
                width: '100px',
            },
            customerFullname: {
                columnType: ColumnType.DATA,
                label: t('customerFullname'),
                width: '150px',
            },
            customerShortcode: {
                columnType: ColumnType.DATA,
                label: t('customerShortcode'),
                width: '150px',
            },
            startDate: {
                columnType: ColumnType.DATA,
                label: t('startDate'),
                renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
                renderDetails: parseDateToLocaleDateTimeString,
                clipboardText: parseDateToLocaleDateTimeString,
            },
            endDate: {
                columnType: ColumnType.DATA,
                label: t('endDate'),
                renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
                renderDetails: parseDateToLocaleDateTimeString,
                clipboardText: parseDateToLocaleDateTimeString,
            },
            note: {
                columnType: ColumnType.DATA,
                label: t('note'),
                width: '100px',
            },
            metadata: {
                columnType: ColumnType.DATA,
                label: t('metadata'),
                width: '100px',
                renderData: (value) => <WfoInlineJson data={value} />,
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

    const { data, isFetching, error } = useGetSubscriptionListQuery(
        graphqlQueryVariables,
    );
    const [getSubscriptionListTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetSubscriptionListQuery();
    const getSubscriptionListForExport = () =>
        getSubscriptionListTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const sortedColumnId = getTypedFieldFromObject(
        sortBy?.field,
        tableColumnConfig,
    );
    if (!sortedColumnId) {
        router.replace(PATH_SUBSCRIPTIONS);
        return null;
    }

    const dataSorting: WfoDataSorting<SubscriptionListItem> = {
        field: sortedColumnId,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };
    const { totalItems, sortFields, filterFields } = data?.pageInfo ?? {};

    return (
        <WfoAdvancedTable
            queryString={dataDisplayParams.queryString}
            onUpdateQueryString={getQueryStringHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            data={
                data
                    ? mapGraphQlSubscriptionsResultToSubscriptionListItems(data)
                    : []
            }
            tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                tableColumnConfig,
                sortFields,
                filterFields,
            )}
            defaultHiddenColumns={hiddenColumns}
            dataSorting={[dataSorting]}
            isLoading={isFetching}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            detailModalTitle={'Details - Subscription'}
            pagination={{
                pageIndex: dataDisplayParams.pageIndex,
                pageSize: dataDisplayParams.pageSize,
                pageSizeOptions: DEFAULT_PAGE_SIZES,
                totalItemCount: totalItems ?? 0,
                onChangePage:
                    getPageIndexChangeHandler<SubscriptionListItem>(
                        setDataDisplayParam,
                    ),
                onChangeItemsPerPage:
                    getPageSizeChangeHandler<SubscriptionListItem>(
                        setDataDisplayParam,
                    ),
            }}
            error={mapRtkErrorToWfoError(error)}
            onUpdateDataSorting={getDataSortHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            onExportData={csvDownloadHandler(
                getSubscriptionListForExport,
                mapGraphQlSubscriptionsResultToSubscriptionListItems,
                mapGraphQlSubscriptionsResultToPageInfo,
                Object.keys(tableColumnConfig),
                getCsvFileNameWithDate('Subscriptions'),
                showToastMessage,
                tError,
            )}
            exportDataIsLoading={isFetchingCsv}
        />
    );
};
