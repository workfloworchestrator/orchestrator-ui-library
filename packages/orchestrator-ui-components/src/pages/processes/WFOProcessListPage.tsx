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
    WFOTableColumns,
    WFOTableWithFilter,
    WFOFilterTabs,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
} from '../../components';
import { ProcessDefinition, SortOrder } from '../../types';
import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { Pagination } from '@elastic/eui/src/components';
import { WFOProcessesListSubscriptionsCell } from './WFOProcessesListSubscriptionsCell';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useRouter } from 'next/router';
import { EuiSpacer } from '@elastic/eui';
import { defaultProcessListTabs, WFOProcessListTabType } from './tabConfig';
import { getProcessListTabTypeFromString } from './getProcessListTabTypeFromString';
import {
    defaultHiddenColumnsActiveProcesses,
    defaultHiddenColumnsCompletedProcesses,
} from './tableConfig';

export const WFOProcessListPage = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WFOProcessListTabType.ACTIVE),
    );

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

    const selectedProcessListTab = getProcessListTabTypeFromString(activeTab);

    const handleChangeProcessListTab = (
        updatedProcessListTab: WFOProcessListTabType,
    ) => {
        setActiveTab(updatedProcessListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultProcessListTabs.find(
        ({ id }) => id === selectedProcessListTab,
    )?.alwaysOnFilters;

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
            filterBy: alwaysOnFilters,
        },
        'processList',
        true,
    );

    if (!data) {
        return <WFOLoading />;
    }

    if (!selectedProcessListTab) {
        router.replace('/processes');
        return null;
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

    const defaultHiddenColumns =
        selectedProcessListTab === WFOProcessListTabType.ACTIVE
            ? defaultHiddenColumnsActiveProcesses
            : defaultHiddenColumnsCompletedProcesses;

    const localStorageKey =
        selectedProcessListTab === WFOProcessListTabType.ACTIVE
            ? ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY;

    return (
        <>
            <WFOFilterTabs
                tabs={defaultProcessListTabs}
                translationNamespace="processes.tabs"
                selectedSubscriptionsTab={selectedProcessListTab}
                onChangeSubscriptionsTab={handleChangeProcessListTab}
            />
            <EuiSpacer size="xxl" />

            <WFOTableWithFilter
                data={data.processes.page}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                pagination={pagination}
                isLoading={isFetching}
                defaultHiddenColumns={defaultHiddenColumns}
                localStorageKey={localStorageKey}
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
        </>
    );
};
