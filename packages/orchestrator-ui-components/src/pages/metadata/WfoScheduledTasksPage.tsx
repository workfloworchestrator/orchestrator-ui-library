import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    WfoDataSorting,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_SCHEDULES_LOCAL_STORAGE_KEY,
    StoredTableConfig,
    WfoDateTime,
    getDataSortHandler,
    getQueryStringHandler,
} from '@/components';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { ColumnType, Pagination } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import {
    ScheduledTasksResponse,
    useGetScheduledTasksQuery,
    useLazyGetScheduledTasksQuery,
} from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import type { GraphqlQueryVariables, ScheduledTaskDefinition } from '@/types';
import { SortOrder } from '@/types';
import {
    getQueryVariablesForExport,
    parseDateToLocaleDateTimeString,
    parseIsoString,
} from '@/utils';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@/utils/csvDownload';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

const TASK_NAME_FIELD: keyof ScheduledTaskDefinition = 'name';

type ScheduledTasksDefinitionExportItem = ScheduledTaskDefinition;

export const WfoScheduledTasksPage = () => {
    const t = useTranslations('metadata.scheduledTasks');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();
    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ScheduledTaskDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ScheduledTaskDefinition>(
        METADATA_SCHEDULES_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ScheduledTaskDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: TASK_NAME_FIELD,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoAdvancedTableColumnConfig<ScheduledTaskDefinition> =
        {
            workflowId: {
                columnType: ColumnType.DATA,
                label: t('task'),
                width: '90px',
            },
            name: {
                columnType: ColumnType.DATA,
                label: t('taskDescription'),
                width: '700px',
            },
            nextRunTime: {
                columnType: ColumnType.DATA,
                label: t('nextRuntime'),
                width: '90px',
                renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
                renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
                clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
                renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
            },
            trigger: {
                columnType: ColumnType.DATA,
                label: t('trigger'),
                width: '90px',
            },
        };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const graphqlQueryVariables: GraphqlQueryVariables<ScheduledTaskDefinition> =
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: sortBy,
            query: queryString || undefined,
        };
    const { data, isFetching, error } = useGetScheduledTasksQuery(
        graphqlQueryVariables,
    );
    const [getSchedulesTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetScheduledTasksQuery();
    const getSchedulesForExport = () =>
        getSchedulesTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const { totalItems, sortFields, filterFields } = data?.pageInfo ?? {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
        onChangePage: getPageIndexChangeHandler(setDataDisplayParam),
        onChangeItemsPerPage: getPageSizeChangeHandler(setDataDisplayParam),
    };

    const dataSorting: WfoDataSorting<ScheduledTaskDefinition> = {
        field: sortBy?.field ?? TASK_NAME_FIELD,
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const mapToExportItems = ({
        schedules,
    }: ScheduledTasksResponse): ScheduledTasksDefinitionExportItem[] => {
        return schedules;
    };

    return (
        <WfoMetadataPageLayout>
            <WfoAdvancedTable
                data={data?.schedules ?? []}
                tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={[dataSorting]}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSorting={getDataSortHandler<ScheduledTaskDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ScheduledTaskDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                error={mapRtkErrorToWfoError(error)}
                queryString={queryString}
                localStorageKey={METADATA_SCHEDULES_LOCAL_STORAGE_KEY}
                onExportData={csvDownloadHandler(
                    getSchedulesForExport,
                    mapToExportItems,
                    (data) => data?.pageInfo || {},
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('Schedules'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
};
