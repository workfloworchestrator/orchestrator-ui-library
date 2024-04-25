import React, { useEffect, useState } from 'react';

import { Pagination } from '@elastic/eui';

import type { StoredTableConfig } from '@/components';
import type { WfoTableColumns } from '@/components';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZES } from '@/components';
import type { WfoDataSorting } from '@/components';
import { WfoTableWithFilter } from '@/components';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '@/components';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import { SortOrder } from '@/types';

interface TableLoaderProps<T extends object> {
    dataLoader: () => void;
    data: T[];
    columns: WfoTableColumns<T>[];
    storageKey: string;
}
export const TableLoader = <T extends object>({
    dataLoader,
    data,
    columns,
    storageKey,
}: TableLoaderProps<T>) => {
    const { showToastMessage } = useShowToastMessage();
    const [tableDefaults, setTableDefaults] = useState<StoredTableConfig<T>>();

    const getStoredTableConfig = useStoredTableConfig<T>(storageKey);

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } = useDataDisplayParams<T>({
        // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
        // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
        // the query to wait for the values to be available
        // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
        pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
        sortBy: {
            field: 'name',
            order: SortOrder.ASC,
        },
    });

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;

    const dataSorting: WfoDataSorting<T> = {
        field: sortBy?.field ?? 'name',
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const { totalItems, sortFields, filterFields } = data?.pageInfo || {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WfoTableWithFilter<T>
            data={data}
            tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                columns,
                sortFields,
                filterFields,
            )}
            dataSorting={dataSorting}
            defaultHiddenColumns={tableDefaults?.hiddenColumns}
            onUpdateDataSort={getDataSortHandler<T>(setDataDisplayParam)}
            onUpdatePage={getPageChangeHandler<T>(setDataDisplayParam)}
            onUpdateQueryString={getQueryStringHandler<T>(setDataDisplayParam)}
            pagination={pagination}
            isLoading={isFetching}
            hasError={isError}
            queryString={queryString}
            localStorageKey={storageKey}
            onExportData={csvDownloadHandler(
                getTasksForExport,
                mapToExportItems,
                (data) => data.pageInfo,
                Object.keys(tableColumns),
                getCsvFileNameWithDate('Tasks'),
                showToastMessage,
                tError,
            )}
            exportDataIsLoading={isFetchingCsv}
        />
    );
};
