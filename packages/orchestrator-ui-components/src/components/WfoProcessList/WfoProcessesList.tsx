import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Pagination } from '@elastic/eui/src/components';

import { GET_PROCESS_LIST_GRAPHQL_QUERY } from '../../graphqlQueries/processListQuery';
import { DataDisplayParams, useQueryWithGraphql } from '../../hooks';
import { WfoProcessListSubscriptionsCell } from '../../pages';
import { Process, SortOrder } from '../../types';
import { parseDateToLocaleDateTimeString } from '../../utils';
import { WfoProcessStatusBadge } from '../WfoBadges';
import { WfoWorkflowTargetBadge } from '../WfoBadges/WfoWorkflowTargetBadge';
import { WfoDateTime } from '../WfoDateTime/WfoDateTime';
import { FilterQuery } from '../WfoFilterTabs';
import { WfoLoading } from '../WfoLoading';
import { PATH_WORKFLOWS } from '../WfoPageTemplate';
import {
    DEFAULT_PAGE_SIZES,
    TableColumnKeys,
    WfoDataSorting,
    WfoTableColumns,
    WfoTableWithFilter,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '../WfoTable';
import { WfoFirstPartUUID } from '../WfoTable/WfoFirstPartUUID';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '../WfoTable/utils/mapSortableAndFilterableValuesToTableColumnConfig';
import {
    graphQlProcessFilterMapper,
    graphQlProcessSortMapper,
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

    const defaultTableColumns: WfoTableColumns<ProcessListItem> = {
        workflowName: {
            field: 'workflowName',
            name: t('workflowName'),
            render: (value, { processId }) => (
                <Link href={`${PATH_WORKFLOWS}/${processId}`}>{value}</Link>
            ),
        },
        lastStep: {
            field: 'lastStep',
            name: t('step'),
        },
        lastStatus: {
            field: 'lastStatus',
            name: t('status'),
            width: '150',
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

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const { data, isFetching } = useQueryWithGraphql(
        GET_PROCESS_LIST_GRAPHQL_QUERY,
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: graphQlProcessSortMapper(sortBy),
            filterBy: graphQlProcessFilterMapper(alwaysOnFilters),
            query: queryString || undefined,
        },
        'processList',
    );

    if (!data) {
        return <WfoLoading />;
    }
    const { totalItems, sortFields, filterFields } = data.processes.pageInfo;

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

    return (
        <WfoTableWithFilter<ProcessListItem>
            queryString={queryString}
            data={mapGraphQlProcessListResultToProcessListItems(data)}
            tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                tableColumns,
                sortFields,
                filterFields,
            )}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            defaultHiddenColumns={defaultHiddenColumns}
            localStorageKey={localStorageKey}
            detailModalTitle={'Details - Process'}
            onUpdateQueryString={getQueryStringHandler(setDataDisplayParam)}
            onUpdatePage={getPageChangeHandler(setDataDisplayParam)}
            onUpdateDataSort={getDataSortHandler(setDataDisplayParam)}
        />
    );
};
