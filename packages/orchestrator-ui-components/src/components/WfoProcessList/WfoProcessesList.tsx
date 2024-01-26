import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Pagination } from '@elastic/eui';

import {
    FilterQuery,
    PATH_WORKFLOWS,
    WfoDateTime,
    WfoProcessStatusBadge,
    WfoWorkflowTargetBadge,
} from '@/components';
import {
    DEFAULT_PAGE_SIZES,
    TableColumnKeys,
    WfoDataSorting,
    WfoFirstPartUUID,
    WfoTableColumns,
    WfoTableWithFilter,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
    mapSortableAndFilterableValuesToTableColumnConfig,
} from '@/components/WfoTable';
import { getProcessListGraphQlQuery } from '@/graphqlQueries';
import { useQueryWithGraphqlLazy, useShowToastMessage } from '@/hooks';
import { DataDisplayParams } from '@/hooks';
import { WfoProcessListSubscriptionsCell } from '@/pages';
import { useGetProcessListQuery } from '@/rtk';
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
    productTag?: string;
    customer: string;
    customerAbbreviation: string;
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
        defaultTableColumns: WfoTableColumns<ProcessListItem>,
    ) => WfoTableColumns<ProcessListItem>;
};

export const WfoProcessesList = ({
    alwaysOnFilters,
    defaultHiddenColumns = [],
    localStorageKey,
    dataDisplayParams,
    setDataDisplayParam,
    overrideDefaultTableColumns,
}: WfoProcessesListProps) => {
    const t = useTranslations('processes.index');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const defaultTableColumns: WfoTableColumns<ProcessListItem> = {
        workflowName: {
            field: 'workflowName',
            name: t('workflowName'),
            width: '20%',
            render: (value, { processId }) => (
                <Link href={`${PATH_WORKFLOWS}/${processId}`}>{value}</Link>
            ),
        },
        lastStep: {
            field: 'lastStep',
            name: t('step'),
            width: '15%',
        },
        lastStatus: {
            field: 'lastStatus',
            name: t('status'),
            width: '100',
            render: (cellValue) => (
                <WfoProcessStatusBadge processStatus={cellValue} />
            ),
        },
        workflowTarget: {
            field: 'workflowTarget',
            name: t('workflowTarget'),
            width: '100',
            render: (target) => <WfoWorkflowTargetBadge target={target} />,
        },
        productTag: {
            field: 'productTag',
            name: t('productTag'),
            width: '100',
        },
        productName: {
            field: 'productName',
            name: t('product'),
            width: '10%',
        },
        customer: {
            field: 'customer',
            name: t('customer'),
            width: '10%',
        },
        customerAbbreviation: {
            field: 'customerAbbreviation',
            name: t('customerAbbreviation'),
            width: '10%',
        },
        subscriptions: {
            field: 'subscriptions',
            name: t('subscriptions'),
            width: '15%',
            render: ({ page: subscriptions }) => (
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
            field: 'createdBy',
            name: t('createdBy'),
            width: '10%',
        },
        assignee: {
            field: 'assignee',
            name: t('assignee'),
            width: '5%',
        },
        processId: {
            field: 'processId',
            name: t('processId'),
            width: '90',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        startedAt: {
            field: 'startedAt',
            name: t('started'),
            width: '100',
            render: (value) => <WfoDateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
        lastModifiedAt: {
            field: 'lastModifiedAt',
            name: t('lastModified'),
            width: '100',
            render: (value) => <WfoDateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
    };

    const tableColumns: WfoTableColumns<ProcessListItem> =
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

    const { data, isFetching, isError } =
        useGetProcessListQuery(processListQueryVars);

    const { processes, totalItems, sortFields, filterFields } = data || {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };
    const dataSorting: WfoDataSorting<ProcessListItem> = {
        field: sortBy?.field ?? 'lastModified',
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const { getData: getProcessListForExport, isFetching: isFetchingCsv } =
        useQueryWithGraphqlLazy(
            getProcessListGraphQlQuery(),
            getQueryVariablesForExport(processListQueryVars),
            ['processes', 'export'],
        );

    return (
        <WfoTableWithFilter<ProcessListItem>
            queryString={queryString}
            data={mapGraphQlProcessListResultToProcessListItems(
                processes || [],
            )}
            tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                tableColumns,
                sortFields,
                filterFields,
            )}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            hasError={isError}
            defaultHiddenColumns={defaultHiddenColumns}
            localStorageKey={localStorageKey}
            detailModalTitle={'Details - Process'}
            onUpdateQueryString={getQueryStringHandler(setDataDisplayParam)}
            onUpdatePage={getPageChangeHandler(setDataDisplayParam)}
            onUpdateDataSort={getDataSortHandler(setDataDisplayParam)}
            onExportData={csvDownloadHandler(
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
