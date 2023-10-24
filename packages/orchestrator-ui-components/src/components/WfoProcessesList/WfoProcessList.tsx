import React, { FC } from 'react';
import Link from 'next/link';
import {
    DEFAULT_PAGE_SIZES,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    TableColumnKeys,
    WfoDataSorting,
    WfoTableColumns,
    WfoTableWithFilter,
} from '../WfoTable';
import { Process, SortOrder } from '../../types';
import { WfoProcessStatusBadge } from '../WfoBadges';
import { WfoProcessListSubscriptionsCell } from '../../pages';
import { WfoFirstPartUUID } from '../WfoTable/WfoFirstPartUUID';
import { useTranslations } from 'next-intl';
import { DataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { WfoLoading } from '../WfoLoading';
import { Pagination } from '@elastic/eui/src/components';
import { FilterQuery } from '../WfoFilterTabs';
import {
    graphQlProcessFilterMapper,
    graphQlProcessSortMapper,
    mapGraphQlProcessListResultToProcessListItems,
} from './processListObjectMappers';
import { WfoDateTime } from '../WfoDateTime/WfoDateTime';
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

export type WfoProcessListProps = {
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

export const WfoProcessList: FC<WfoProcessListProps> = ({
    alwaysOnFilters,
    defaultHiddenColumns = [],
    localStorageKey,
    dataDisplayParams,
    setDataDisplayParam,
    overrideDefaultTableColumns,
}) => {
    const t = useTranslations('processes.index');

    const defaultTableColumns: WfoTableColumns<ProcessListItem> = {
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
            width: '100',
            render: (cellValue) => (
                <WfoProcessStatusBadge processStatus={cellValue} />
            ),
        },
        workflowTarget: {
            field: 'workflowTarget',
            name: t('workflowTarget'),
            width: '100',
        },
        productTag: {
            field: 'productTag',
            name: t('productTag'),
            width: '100',
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
        },
        assignee: {
            field: 'assignee',
            name: t('assignee'),
        },
        processId: {
            field: 'processId',
            name: t('processId'),
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
        return <WfoLoading />;
    }
    const { totalItems } = data.processes.pageInfo;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };
    const dataSorting: WfoDataSorting<ProcessListItem> = {
        field: dataDisplayParams.sortBy?.field ?? 'lastModified',
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    return (
        <WfoTableWithFilter<ProcessListItem>
            data={mapGraphQlProcessListResultToProcessListItems(data)}
            tableColumns={tableColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            defaultHiddenColumns={defaultHiddenColumns}
            localStorageKey={localStorageKey}
            detailModalTitle={'Details - Process'}
            onUpdateEsQueryString={getEsQueryStringHandler(setDataDisplayParam)}
            onUpdatePage={getPageChangeHandler(setDataDisplayParam)}
            onUpdateDataSort={getDataSortHandler(setDataDisplayParam)}
        />
    );
};
