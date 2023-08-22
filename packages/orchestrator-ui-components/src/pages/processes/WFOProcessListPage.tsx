import React from 'react';
import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    getTableConfigFromLocalStorage,
    WFODataSorting,
    WFOFilterTabs,
    WFOLoading,
    WFOProcessStatusBadge,
    WFOTableColumns,
    WFOTableWithFilter,
} from '../../components';
import { Process, SortOrder } from '../../types';
import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { Pagination } from '@elastic/eui/src/components';
import { WFOProcessesListSubscriptionsCell } from './WFOProcessesListSubscriptionsCell';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useRouter } from 'next/router';
import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import { defaultProcessListTabs, WFOProcessListTabType } from './tabConfig';
import { getProcessListTabTypeFromString } from './getProcessListTabTypeFromString';
import {
    defaultHiddenColumnsActiveProcesses,
    defaultHiddenColumnsCompletedProcesses,
} from './tableConfig';
import { useTranslations } from 'next-intl';

export const WFOProcessListPage = () => {
    const router = useRouter();
    const t = useTranslations('processes.index');

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WFOProcessListTabType.ACTIVE),
    );

    const initialPageSize =
        getTableConfigFromLocalStorage(
            ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
        )?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<Process>({
            pageSize: initialPageSize,
            sortBy: {
                // Todo: waiting for fix in backend -- currently the sortBy field id's are not matching with the returned data
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/91
                // @ts-ignore
                field: 'modified',
                // field: 'lastModified',
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

    const tableColumns: WFOTableColumns<Process> = {
        workflowName: {
            field: 'workflowName',
            name: t('workflowName'),
        },
        step: {
            field: 'step',
            name: t('step'),
        },
        status: {
            field: 'status',
            name: t('status'),
            render: (cellValue) => (
                <WFOProcessStatusBadge processStatus={cellValue} />
            ),
        },
        workflowTarget: {
            field: 'workflowTarget',
            name: t('workflowTarget'),
        },
        product: {
            field: 'product',
            name: t('product'),
        },
        customer: {
            field: 'customer',
            name: t('customer'),
        },
        subscriptions: {
            field: 'subscriptions',
            name: t('subscriptions'),
            width: '400',
            render: ({ page: subscriptions }) => (
                <WFOProcessesListSubscriptionsCell
                    subscriptions={subscriptions}
                    numberOfSubscriptionsToRender={1}
                />
            ),
            renderDetails: ({ page: subscriptions }) => (
                <WFOProcessesListSubscriptionsCell
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
        },
        assignee: {
            field: 'assignee',
            name: t('assignee'),
        },
        processId: {
            field: 'processId',
            name: t('processId'),
        },
        started: {
            field: 'started',
            name: t('started'),
        },
        lastModified: {
            field: 'lastModified',
            name: t('lastModified'),
        },
    };

    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_LIST_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: dataDisplayParams.sortBy,
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

    const dataSorting: WFODataSorting<Process> = {
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
            <EuiSpacer />

            <EuiPageHeader pageTitle="Processes" />
            <EuiSpacer size="m" />

            <WFOFilterTabs
                tabs={defaultProcessListTabs}
                translationNamespace="processes.tabs"
                selectedTab={selectedProcessListTab}
                onChangeTab={handleChangeProcessListTab}
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
                detailModalTitle={'Details - Process'}
                onUpdateEsQueryString={getEsQueryStringHandler<Process>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<Process>(
                    setDataDisplayParam,
                )}
                onUpdateDataSort={getDataSortHandler<Process>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
            />
        </>
    );
};
