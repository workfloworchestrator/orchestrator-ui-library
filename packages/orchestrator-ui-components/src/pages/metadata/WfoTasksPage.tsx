import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';
import type { Pagination } from '@elastic/eui/src/components';

import { WfoTableWithFilter, WfoWorkflowTargetBadge } from '@/components';
import type { WfoDataSorting, WfoTableColumns } from '@/components';
import { StoredTableConfig } from '@/components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY,
    WfoProductBlockBadge,
} from '@/components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '@/components';
import { WfoDateTime } from '@/components/WfoDateTime/WfoDateTime';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/utils/mapSortableAndFilterableValuesToTableColumnConfig';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import { TasksResponse, useGetTasksQuery, useLazyGetTasksQuery } from '@/rtk';
import type { GraphqlQueryVariables, TaskDefinition } from '@/types';
import { BadgeType, SortOrder } from '@/types';
import {
    getQueryVariablesForExport,
    onlyUnique,
    parseDateToLocaleDateTimeString,
    parseIsoString,
} from '@/utils';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@/utils/csvDownload';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';
import {
    graphQlTaskListMapper,
    mapTaskDefinitionToTaskListItem,
} from './taskListObjectMapper';

export type TaskListItem = Pick<
    TaskDefinition,
    'name' | 'description' | 'target' | 'createdAt'
> & {
    productTags: string[];
};

type TaskListExportItem = Omit<TaskListItem, 'productTags'> & {
    productTags: string;
};

export const WfoTasksPage = () => {
    const t = useTranslations('metadata.tasks');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<TaskListItem>>();

    const getStoredTableConfig = useStoredTableConfig<TaskListItem>(
        METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<TaskListItem>({
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

    const tableColumns: WfoTableColumns<TaskListItem> = {
        name: {
            field: 'name',
            name: t('name'),
            width: '20%',
            render: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.TASK}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: 'description',
            name: t('description'),
            width: '40%',
        },
        target: {
            field: 'target',
            name: t('target'),
            width: '15%',
            render: (target) => <WfoWorkflowTargetBadge target={target} />,
        },
        productTags: {
            field: 'productTags',
            name: t('productTags'),
            width: '20%',
            render: (productTags) => (
                <>
                    {productTags
                        ?.filter(onlyUnique)
                        .map((productTag, index) => (
                            <WfoProductBlockBadge
                                key={index}
                                badgeType={BadgeType.PRODUCT_TAG}
                            >
                                {productTag}
                            </WfoProductBlockBadge>
                        ))}
                </>
            ),
            renderDetails: (productTags) => (
                <EuiBadgeGroup gutterSize="s">
                    {productTags
                        ?.filter(onlyUnique)
                        .map((productTag, index) => (
                            <WfoProductBlockBadge
                                key={index}
                                badgeType={BadgeType.PRODUCT_TAG}
                            >
                                {productTag}
                            </WfoProductBlockBadge>
                        ))}
                </EuiBadgeGroup>
            ),
        },
        createdAt: {
            field: 'createdAt',
            name: t('createdAt'),
            width: '15%',
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;

    const taskListQueryVariables: GraphqlQueryVariables<TaskDefinition> = {
        first: pageSize,
        after: pageIndex * pageSize,
        sortBy: graphQlTaskListMapper(sortBy),
        query: queryString || undefined,
    };
    const { data, isFetching, isLoading, isError } = useGetTasksQuery(
        taskListQueryVariables,
    );

    const [getTasksTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetTasksQuery();

    const getTasksForExport = () =>
        getTasksTrigger(
            getQueryVariablesForExport(taskListQueryVariables),
        ).unwrap();

    const dataSorting: WfoDataSorting<TaskListItem> = {
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

    const mapToExportItems = (
        tasksResponse: TasksResponse,
    ): TaskListExportItem[] => {
        const { tasks } = tasksResponse;
        return tasks.map(
            ({ name, target, description, createdAt, products }) => {
                const uniqueProducts = products
                    .map((product) => product.tag)
                    .filter(onlyUnique);
                return {
                    name,
                    target,
                    description,
                    createdAt,
                    productTags: uniqueProducts.join(' - '),
                };
            },
        );
    };

    return (
        <WfoMetadataPageLayout>
            <WfoTableWithFilter<TaskListItem>
                data={data ? mapTaskDefinitionToTaskListItem(data.tasks) : []}
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<TaskListItem>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<TaskListItem>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<TaskListItem>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                loadingState={{
                    isLoading,
                    isFetching,
                }}
                hasError={isError}
                queryString={queryString}
                localStorageKey={METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY}
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
        </WfoMetadataPageLayout>
    );
};
