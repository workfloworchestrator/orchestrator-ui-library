import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    FilterQuery,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    getTableConfigFromLocalStorage,
    TableColumnKeys,
    TASK_LIST_TABLE_LOCAL_STORAGE_KEY,
    WFODataSorting,
    WFOLoading,
    WFOProcessStatusBadge,
    WFOTableColumns,
    WFOTableWithFilter,
} from '../../components';
import { Process, SortOrder } from '../../types';
import { WFOProcessesListSubscriptionsCell } from '../processes';
import { WFOFirstPartUUID } from '../../components/WFOTable/WFOFirstPartUUID';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
    useDataDisplayParams,
    useOrchestratorTheme,
    useQueryWithGraphql,
} from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { EuiButton, EuiHorizontalRule, EuiSpacer } from '@elastic/eui';
import { Pagination } from '@elastic/eui/src/components';
import { WFOPageHeader } from '../../components/WFOPageHeader/WFOPageHeader';
import { WFOPlusCircleFill } from '../../icons';

export const WFOTaskListPage = () => {
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('processes.index');

    const initialPageSize =
        getTableConfigFromLocalStorage(TASK_LIST_TABLE_LOCAL_STORAGE_KEY)
            ?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

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

    const isTaskFilter: FilterQuery<Process> = {
        // @ts-ignore waiting for fix in backend
        field: 'istask',
        value: 'true',
    };

    // Todo: to avoid duplicate code, introduce some object key sorter
    // Sort object keys: https://linuxhint.com/sort-the-keys-of-an-object-in-javascript/
    // Sort function: https://stackoverflow.com/questions/5002848/how-to-define-custom-sort-function-in-javascript
    // Make a function that accepts an array of keys to use for the compare fn. The position in the array can be used as a value to compare with
    const tableColumns: WFOTableColumns<Process> = {
        assignee: {
            field: 'assignee',
            name: t('assignee'),
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
        workflowName: {
            field: 'workflowName',
            name: t('workflowName'),
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
        processId: {
            field: 'processId',
            name: t('processId'),
            render: (value) => <WFOFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
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
            filterBy: [isTaskFilter],
        },
        'processList',
        true,
    );

    if (!data) {
        return <WFOLoading />;
    }

    console.log('data', data);

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

    const defaultHiddenColumns: TableColumnKeys<Process> = [
        'workflowTarget',
        'product',
        'customer',
        'createdBy',
        'processId',
    ];

    return (
        <>
            <EuiSpacer />

            <WFOPageHeader pageTitle="Tasks">
                <EuiButton>Rerun all</EuiButton>
                <EuiButton
                    fill
                    iconType={() => (
                        <WFOPlusCircleFill color={theme.colors.emptyShade} />
                    )}
                >
                    New task
                </EuiButton>
            </WFOPageHeader>
            <EuiHorizontalRule />

            <EuiSpacer size="xxl" />

            <WFOTableWithFilter
                data={data.processes.page}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                pagination={pagination}
                isLoading={isFetching}
                defaultHiddenColumns={defaultHiddenColumns}
                localStorageKey={TASK_LIST_TABLE_LOCAL_STORAGE_KEY}
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
