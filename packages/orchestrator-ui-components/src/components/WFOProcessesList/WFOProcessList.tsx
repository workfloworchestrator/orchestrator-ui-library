import React, { FC } from 'react';
import Link from 'next/link';
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
import { WFOProcessListSubscriptionsCell } from '../../pages';
import { WFOFirstPartUUID } from '../WFOTable/WFOFirstPartUUID';
import { useTranslations } from 'next-intl';
import { DataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { WFOLoading } from '../WFOLoading';
import { Pagination } from '@elastic/eui/src/components';
import { FilterQuery } from '../WFOFilterTabs';
import {
    graphQlProcessFilterMapper,
    graphQlProcessSortMapper,
    mapGraphQlProcessListResultToProcessListItems,
} from './processListObjectMappers';
import { WFODateTime } from '../WFODateTime/WFODateTime';
import { parseDateToLocaleDateTimeString } from '../../utils';

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

export type WFOProcessListProps = {
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
        defaultTableColumns: WFOTableColumns<ProcessListItem>,
    ) => WFOTableColumns<ProcessListItem>;
};

export const WFOProcessList: FC<WFOProcessListProps> = ({
    alwaysOnFilters,
    defaultHiddenColumns = [],
    localStorageKey,
    dataDisplayParams,
    setDataDisplayParam,
    overrideDefaultTableColumns,
}) => {
    const t = useTranslations('processes.index');

    const defaultTableColumns: WFOTableColumns<ProcessListItem> = {
        workflowName: {
            field: 'workflowName',
            name: t('workflowName'),
            render: (value, { processId }) => (
                <Link href={`/processes/${processId}`}>{value}</Link>
            ),
        },
        lastStep: {
            field: 'lastStep',
            name: t('step'),
        },
        lastStatus: {
            field: 'lastStatus',
            name: t('status'),
            render: (cellValue) => (
                <WFOProcessStatusBadge processStatus={cellValue} />
            ),
        },
        workflowTarget: {
            field: 'workflowTarget',
            name: t('workflowTarget'),
        },
        productTag: {
            field: 'productTag',
            name: t('productTag'),
        },
        productName: {
            field: 'productName',
            name: t('product'),
        },
        customer: {
            field: 'customer',
            name: t('customer'),
        },
        customerAbbreviation: {
            field: 'customerAbbreviation',
            name: t('customerAbbreviation'),
        },
        subscriptions: {
            field: 'subscriptions',
            name: t('subscriptions'),
            width: '400',
            render: ({ page: subscriptions }) => (
                <WFOProcessListSubscriptionsCell
                    subscriptions={subscriptions}
                    numberOfSubscriptionsToRender={1}
                />
            ),
            renderDetails: ({ page: subscriptions }) => (
                <WFOProcessListSubscriptionsCell
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
        startedAt: {
            field: 'startedAt',
            name: t('started'),
            render: (value) => <WFODateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
        lastModifiedAt: {
            field: 'lastModifiedAt',
            name: t('lastModified'),
            render: (value) => <WFODateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
    };
    const tableColumns: WFOTableColumns<ProcessListItem> =
        overrideDefaultTableColumns
            ? overrideDefaultTableColumns(defaultTableColumns)
            : defaultTableColumns;

    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_LIST_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: graphQlProcessSortMapper(dataDisplayParams.sortBy),
            filterBy: graphQlProcessFilterMapper(alwaysOnFilters),
        },
        'processList',
    );

    if (!data) {
        return <WFOLoading />;
    }
    const { totalItems } = data.processes.pageInfo;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };
    const dataSorting: WFODataSorting<ProcessListItem> = {
        field: dataDisplayParams.sortBy?.field ?? 'lastModified',
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    return (
        <WFOTableWithFilter
            data={mapGraphQlProcessListResultToProcessListItems(data)}
            tableColumns={tableColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            defaultHiddenColumns={defaultHiddenColumns}
            localStorageKey={localStorageKey}
            detailModalTitle={'Details - Process'}
            onUpdateEsQueryString={getEsQueryStringHandler<ProcessListItem>(
                setDataDisplayParam,
            )}
            onUpdatePage={getPageChangeHandler<ProcessListItem>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<ProcessListItem>(
                dataDisplayParams,
                setDataDisplayParam,
            )}
        />
    );
};
