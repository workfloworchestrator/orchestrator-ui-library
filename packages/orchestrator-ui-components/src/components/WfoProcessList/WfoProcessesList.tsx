import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
    FilterQuery,
    PATH_WORKFLOWS,
    WfoDateTime,
    WfoProcessStatusBadge,
    WfoWorkflowTargetBadge,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import {
    DEFAULT_PAGE_SIZES,
    TableColumnKeys,
    WfoDataSorting,
    WfoFirstPartUUID,
    getDataSortHandler,
    getQueryStringHandler,
} from '@/components/WfoTable';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { ColumnType, Pagination } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import { useShowToastMessage } from '@/hooks';
import { DataDisplayParams } from '@/hooks';
import { WfoProcessListSubscriptionsCell } from '@/pages';
import {
    ProcessListResponse,
    useGetProcessListQuery,
    useLazyGetProcessListQuery,
} from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import { GraphqlQueryVariables, Process, SortOrder } from '@/types';
import { parseDateToLocaleDateTimeString } from '@/utils';
import { getQueryVariablesForExport } from '@/utils';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@/utils/csvDownload';

import {
    graphQlProcessFilterMapper,
    graphQlProcessSortMapper,
    mapGraphQlProcessListExportResultToProcessListItems,
    mapGraphQlProcessListResultToPageInfo,
    mapGraphQlProcessListResultToProcessListItems,
} from './processListObjectMappers';

export type ProcessListItem = Pick<
    Process,
    | 'workflowName'
    | 'lastStep'
    | 'lastStatus'
    | 'workflowTarget'
    | 'createdBy'
    | 'assignee'
    | 'processId'
    | 'subscriptions'
> & {
    startedAt: Date;
    lastModifiedAt: Date;
    productName?: string;
    tag?: string;
    customer: string;
    customerAbbreviation: string;
};

export type ProcessListExportItem = Omit<ProcessListItem, 'subscriptions'> & {
    subscriptions: string;
};

export type WfoProcessesListProps = {
    alwaysOnFilters?: FilterQuery<ProcessListItem>[];
    defaultHiddenColumns: TableColumnKeys<ProcessListItem> | undefined;
    localStorageKey: string;
    dataDisplayParams: DataDisplayParams<ProcessListItem>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<ProcessListItem>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<ProcessListItem>[DisplayParamKey],
    ) => void;
    overrideDefaultTableColumns?: (
        defaultTableColumns: WfoAdvancedTableColumnConfig<ProcessListItem>,
    ) => WfoAdvancedTableColumnConfig<ProcessListItem>;
};

export const WfoProcessesList = ({
    alwaysOnFilters,
    defaultHiddenColumns = [],
    localStorageKey,
    dataDisplayParams,
    overrideDefaultTableColumns,
    setDataDisplayParam,
}: WfoProcessesListProps) => {
    const t = useTranslations('processes.index');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const defaultTableColumns: WfoAdvancedTableColumnConfig<ProcessListItem> = {
        workflowName: {
            columnType: ColumnType.DATA,
            label: t('workflowName'),
            width: '20%',
            renderData: (value, { processId }) => (
                <Link href={`${PATH_WORKFLOWS}/${processId}`}>{value}</Link>
            ),
        },
        lastStep: {
            columnType: ColumnType.DATA,
            label: t('step'),
            width: '15%',
            renderTooltip: (value) => value,
        },
        lastStatus: {
            columnType: ColumnType.DATA,
            label: t('status'),
            width: '100',
            renderData: (cellValue) => (
                <WfoProcessStatusBadge processStatus={cellValue} />
            ),
        },
        workflowTarget: {
            columnType: ColumnType.DATA,
            label: t('workflowTarget'),
            width: '100',
            renderData: (target) => <WfoWorkflowTargetBadge target={target} />,
        },
        tag: {
            columnType: ColumnType.DATA,
            label: t('productTag'),
            width: '100',
        },
        productName: {
            columnType: ColumnType.DATA,
            label: t('product'),
            width: '10%',
        },
        customer: {
            columnType: ColumnType.DATA,
            label: t('customer'),
            width: '10%',
        },
        customerAbbreviation: {
            columnType: ColumnType.DATA,
            label: t('customerAbbreviation'),
            width: '10%',
        },
        subscriptions: {
            columnType: ColumnType.DATA,
            label: t('subscriptions'),
            width: '15%',
            renderData: ({ page: subscriptions }) => (
                <WfoProcessListSubscriptionsCell
                    subscriptions={subscriptions}
                    numberOfSubscriptionsToRender={1}
                />
            ),
            renderDetails: ({ page: subscriptions }) => (
                <WfoProcessListSubscriptionsCell
                    subscriptions={subscriptions}
                />
            ),
            clipboardText: ({ page: subscriptions }) =>
                subscriptions
                    .map(({ subscriptionId }) => subscriptionId)
                    .join(', '),
        },
        createdBy: {
            columnType: ColumnType.DATA,
            label: t('createdBy'),
            width: '10%',
        },
        assignee: {
            columnType: ColumnType.DATA,
            label: t('assignee'),
            width: '5%',
        },
        processId: {
            columnType: ColumnType.DATA,
            label: t('processId'),
            width: '90',
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
            renderTooltip: (value) => value,
        },
        startedAt: {
            columnType: ColumnType.DATA,
            label: t('started'),
            width: '100',
            renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
            renderTooltip: (value) => value.toString(),
        },
        lastModifiedAt: {
            columnType: ColumnType.DATA,
            label: t('lastModified'),
            width: '100',
            renderData: (value) => <WfoDateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
            renderTooltip: (value) => value.toString(),
        },
    };

    const tableColumns: WfoAdvancedTableColumnConfig<ProcessListItem> =
        overrideDefaultTableColumns
            ? overrideDefaultTableColumns(defaultTableColumns)
            : defaultTableColumns;

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;

    const processListQueryVars: GraphqlQueryVariables<Process> = {
        first: pageSize,
        after: pageIndex * pageSize,
        sortBy: graphQlProcessSortMapper(sortBy),
        filterBy: graphQlProcessFilterMapper(alwaysOnFilters),
        query: queryString || undefined,
    };

    const { data, isFetching, error } =
        useGetProcessListQuery(processListQueryVars);

    const [getProcessListTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetProcessListQuery();

    const { processes, pageInfo } = data || {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: pageInfo?.totalItems ? pageInfo.totalItems : 0,
        onChangePage: getPageIndexChangeHandler(setDataDisplayParam),
        onChangeItemsPerPage: getPageSizeChangeHandler(setDataDisplayParam),
    };
    const dataSorting: WfoDataSorting<ProcessListItem> = {
        field: sortBy?.field ?? 'lastModified',
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const getProcessListForExport = () =>
        getProcessListTrigger(
            getQueryVariablesForExport(processListQueryVars),
        ).unwrap();

    return (
        <WfoAdvancedTable<ProcessListItem>
            queryString={queryString}
            data={mapGraphQlProcessListResultToProcessListItems(
                processes || [],
            )}
            tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                tableColumns,
                pageInfo?.sortFields,
                pageInfo?.filterFields,
            )}
            dataSorting={[dataSorting]}
            pagination={pagination}
            isLoading={isFetching}
            error={mapRtkErrorToWfoError(error)}
            defaultHiddenColumns={defaultHiddenColumns}
            localStorageKey={localStorageKey}
            detailModalTitle={'Details - Process'}
            onUpdateQueryString={getQueryStringHandler(setDataDisplayParam)}
            onUpdateDataSorting={getDataSortHandler(setDataDisplayParam)}
            onExportData={csvDownloadHandler<
                ProcessListResponse,
                ProcessListExportItem
            >(
                getProcessListForExport,
                mapGraphQlProcessListExportResultToProcessListItems,
                mapGraphQlProcessListResultToPageInfo,
                Object.keys(tableColumns),
                getCsvFileNameWithDate('Processes'),
                showToastMessage,
                tError,
            )}
            exportDataIsLoading={isFetchingCsv}
        />
    );
};
