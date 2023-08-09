import React from 'react';
import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    WFODataSorting,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    getTableConfigFromLocalStorage,
    WFOLoading,
    TableColumnKeys,
    WFOTableColumns,
    WFOTableWithFilter,
} from '../../components';
import { ProcessDefinition, SortOrder } from '../../types';
import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { Pagination } from '@elastic/eui/src/components';
import { WFOProcessesListSubscriptionsCell } from './WFOProcessesListSubscriptionsCell';

const defaultHiddenColumns: TableColumnKeys<ProcessDefinition> = [
    'product',
    'customer',
    'createdBy',
    'assignee',
    'id',
];

export const WFOProcessListPage = () => {
    const initialPageSize =
        getTableConfigFromLocalStorage(
            ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
        )?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProcessDefinition>({
            pageSize: initialPageSize,
            sortBy: {
                field: 'lastModified',
                order: SortOrder.DESC,
            },
        });

    const tableColumns: WFOTableColumns<ProcessDefinition> = {
        workflowName: {
            field: 'workflowName',
            name: 'Workflow Name',
        },
        lastStep: {
            field: 'lastStep',
            name: 'Last Step',
        },

        status: {
            field: 'status',
            name: 'Status',
        },
        product: {
            field: 'product',
            name: 'Product',
        },
        customer: {
            field: 'customer',
            name: 'Customer',
        },
        subscriptions: {
            field: 'subscriptions',
            name: 'Subscriptions',
            width: '400',
            render: ({ page }) => (
                <WFOProcessesListSubscriptionsCell subscriptions={page} />
            ),
        },
        createdBy: {
            field: 'createdBy',
            name: 'Created By',
        },
        assignee: {
            field: 'assignee',
            name: 'Assignee',
        },
        id: {
            field: 'id',
            name: 'ID',
        },
        started: {
            field: 'started',
            name: 'Started',
        },
        lastModified: {
            field: 'lastModified',
            name: 'Last Modified',
        },
    };

    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_LIST_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            // Todo: waiting for fix in backend -- currently the sortBy field id's are not matching with the returned data
            // sortBy: { field: 'lastModified', order: SortOrder.DESC },
            // @ts-ignore
            sortBy: { field: 'modified', order: SortOrder.DESC },
            // Todo: this should be an always-on filter, see Subscriptions page
            filterBy: [
                {
                    field: 'status',
                    value: 'created-running-suspended-waiting-failed-resumed',
                },
            ],
        },
        'processList',
        true,
    );

    if (!data) {
        return <WFOLoading />;
    }

    const dataSorting: WFODataSorting<ProcessDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? 'lastModified',
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const { totalItems } = data.processes.pageInfo;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WFOTableWithFilter
            data={data.processes.page}
            tableColumns={tableColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            defaultHiddenColumns={defaultHiddenColumns}
            localStorageKey={ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY}
            onUpdateEsQueryString={getEsQueryStringHandler<ProcessDefinition>(
                setDataDisplayParam,
            )}
            onUpdatePage={getPageChangeHandler<ProcessDefinition>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<ProcessDefinition>(
                dataDisplayParams,
                setDataDisplayParam,
            )}
        />
    );
};
