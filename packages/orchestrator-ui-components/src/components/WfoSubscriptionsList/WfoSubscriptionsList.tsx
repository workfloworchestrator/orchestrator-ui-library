import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    FilterQuery,
    PATH_SUBSCRIPTIONS,
    Pagination,
    WfoDateTime,
    WfoInlineJson,
    WfoInsyncIcon,
    WfoJsonCodeBlock,
    WfoSubscriptionStatusBadge,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import { WfoSubscriptionNoteEdit } from '@/components/WfoInlineNoteEdit/WfoSubscriptionNoteEdit';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { DataDisplayParams, useShowToastMessage } from '@/hooks';
import { UseQuery } from '@/rtk';
import {
    SubscriptionListResponse,
    useGetSubscriptionListQuery,
    useLazyGetSubscriptionListQuery,
} from '@/rtk/endpoints/subscriptionList';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { GraphqlQueryVariables, SortOrder, Subscription } from '@/types';
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
                width: '100px',
                renderData: (value) => <WfoFirstPartUUID UUID={value} />,
                renderDetails: (value) => value,
                renderTooltip: (value) => value,
            },
            description: {
                columnType: ColumnType.DATA,
                label: t('description'),
                width: '500px',
                renderData: (value, record) => (
                    <Link href={`/subscriptions/${record.subscriptionId}`}>
                        {value}
                    </Link>
                ),
                renderTooltip: (value) => value,
            },
            status: {
                columnType: ColumnType.DATA,
                label: t('status'),
                width: '120px',
                renderData: (value) => (
                    <WfoSubscriptionStatusBadge status={value} />
                ),
            },
            insync: {
                columnType: ColumnType.DATA,
                label: t('insync'),
                width: '80px',
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
            },
            customerShortcode: {
                columnType: ColumnType.DATA,
                label: t('customerShortcode'),
                width: '150px',
            },
            startDate: {
                columnType: ColumnType.DATA,
                label: t('startDate'),
                width: '120px',
                renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
                renderDetails: parseDateToLocaleDateTimeString,
                clipboardText: parseDateToLocaleDateTimeString,
                renderTooltip: (cellValue) => cellValue?.toString(),
            },
            endDate: {
                columnType: ColumnType.DATA,
                label: t('endDate'),
                width: '120px',
                renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
                renderDetails: parseDateToLocaleDateTimeString,
                clipboardText: parseDateToLocaleDateTimeString,
                renderTooltip: (cellValue) => cellValue?.toString(),
            },
            note: {
                columnType: ColumnType.DATA,
                label: t('note'),
                renderData: (cellValue, row) => {
                    return (
                        <WfoSubscriptionNoteEdit
                            queryVariables={graphqlQueryVariables}
                            subscriptionId={row.subscriptionId}
                            onlyShowOnHover={true}
                            useQuery={
                                useGetSubscriptionListQuery as UseQuery<
                                    SubscriptionListResponse,
                                    Subscription
                                >
                            }
                        />
                    );
                },
            },
            metadata: {
                columnType: ColumnType.DATA,
                label: t('metadata'),
                width: '100px',
                renderData: (value) => <WfoInlineJson data={value} />,
                renderDetails: (value) =>
                    value && <WfoJsonCodeBlock data={value} isBasicStyle />,
                renderTooltip: (value) =>
                    value && (
                        <WfoJsonCodeBlock data={value} isBasicStyle={false} />
                    ),
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

    const pagination: Pagination = {
        pageIndex: dataDisplayParams.pageIndex,
        pageSize: dataDisplayParams.pageSize,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ?? 0,
        onChangePage:
            getPageIndexChangeHandler<SubscriptionListItem>(
                setDataDisplayParam,
            ),
        onChangeItemsPerPage:
            getPageSizeChangeHandler<SubscriptionListItem>(setDataDisplayParam),
    };

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
            pagination={pagination}
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
