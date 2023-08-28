import React, { FC } from 'react';
import {
    DEFAULT_PAGE_SIZES,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    TableColumnKeys,
    WFODataSorting,
    WFOTableColumns,
    WFOTableWithFilter,
} from '../WFOTable';
import { Process, SortOrder } from '../../types';
import { WFOProcessStatusBadge } from '../WFOBadges';
import { WFOProcessesListSubscriptionsCell } from '../../pages';
import { WFOFirstPartUUID } from '../WFOTable/WFOFirstPartUUID';
import { useTranslations } from 'next-intl';
import { DataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { WFOLoading } from '../WFOLoading';
import { Pagination } from '@elastic/eui/src/components';
import { FilterQuery } from '../WFOFilterTabs';

export type WFOProcessesListProps = {
    alwaysOnFilters?: FilterQuery<Process>[];
    defaultHiddenColumns: TableColumnKeys<Process>;
    localStorageKey: string;
    dataDisplayParams: DataDisplayParams<Process>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<Process>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<Process>[DisplayParamKey],
    ) => void;
    overrideTableColumns?: (
        defaultTableColumns: WFOTableColumns<Process>,
    ) => WFOTableColumns<Process>;
};

export const WFOProcessesList: FC<WFOProcessesListProps> = ({
    alwaysOnFilters,
    defaultHiddenColumns,
    localStorageKey,
    dataDisplayParams,
    setDataDisplayParam,
    overrideTableColumns,
}) => {
    const t = useTranslations('processes.index');

    const defaultTableColumns: WFOTableColumns<Process> = {
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
    const tableColumns: WFOTableColumns<Process> = overrideTableColumns
        ? overrideTableColumns(defaultTableColumns)
        : defaultTableColumns;

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

    return (
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
            onUpdatePage={getPageChangeHandler<Process>(setDataDisplayParam)}
            onUpdateDataSort={getDataSortHandler<Process>(
                dataDisplayParams,
                setDataDisplayParam,
            )}
        />
    );
};
