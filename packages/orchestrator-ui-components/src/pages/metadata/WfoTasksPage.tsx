import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup, EuiButtonIcon, EuiContextMenuItem } from '@elastic/eui';

import {
    PATH_METADATA_PRODUCTS,
    WfoFirstPartUUID,
    WfoPopover,
    WfoScheduledTasksBadgesContainer,
    WfoWorkflowTargetBadge,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import type { WfoDataSorting } from '@/components';
import { StoredTableConfig } from '@/components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY,
    WfoProductBlockBadge,
} from '@/components';
import { getDataSortHandler, getQueryStringHandler } from '@/components';
import { WfoDateTime } from '@/components/WfoDateTime/WfoDateTime';
import { WfoMetadataDescriptionField } from '@/components/WfoMetadata/WfoMetadataDescriptionField';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import {
    ColumnType,
    Pagination,
} from '@/components/WfoTable/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';
import { useGetTranslationMessages } from '@/messages';
import {
    TasksResponse,
    useGetTasksQuery,
    useLazyGetTasksQuery,
    useUpdateWorkflowMutation,
} from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import type { GraphqlQueryVariables, TaskDefinition } from '@/types';
import { BadgeType, ScheduleFrequency, SortOrder } from '@/types';
import {
    getConcatenatedResult,
    getQueryUrl,
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
    'workflowId' | 'name' | 'description' | 'target' | 'createdAt'
> & {
    productTags: string[];
    scheduleFrequency: ScheduleFrequency[];
};

export type TaskListExportItem = Omit<
    TaskListItem,
    'productTags' | 'scheduleFrequency'
> & {
    productTags: string;
};

interface ScheduleTaskPopoverMenuProps {
    workflowId: string;
}

const ScheduleTaskPopoverMenu = ({
    workflowId,
}: ScheduleTaskPopoverMenuProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const button = (
        <EuiButtonIcon
            iconType={() => <WfoDotsHorizontal />}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            aria-label="Schedule task popover menu"
            isLoading={false}
        />
    );

    return (
        <WfoPopover
            id="schedule-task-popover-menu"
            isLoading={false}
            PopoverContent={() => (
                <SetScheduleButton
                    workflowId={workflowId}
                    closePopover={() => setIsPopoverOpen(false)}
                />
            )}
            button={button}
            isPopoverOpen={isPopoverOpen}
            closePopover={() => setIsPopoverOpen(false)}
        />
    );
};

const SetScheduleButton = ({
    workflowId,
    closePopover,
}: {
    workflowId: string;
    closePopover: () => void;
}) => {
    const t = useTranslations('metadata.tasks');
    return (
        <EuiContextMenuItem
            icon="gear"
            css={{
                whiteSpace: 'nowrap',
            }}
            onClick={() => {
                console.log('workflowId', workflowId);
                closePopover();
            }}
        >
            {t('addSchedule')}
        </EuiContextMenuItem>
    );
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
    const [updateWorkflow] = useUpdateWorkflowMutation();

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

    const tableColumns: WfoAdvancedTableColumnConfig<TaskListItem> = {
        workflowId: {
            columnType: ColumnType.DATA,
            label: t('workflowId'),
            width: '95px',
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
            renderTooltip: (value) => value,
        },
        name: {
            columnType: ColumnType.DATA,
            label: t('name'),
            renderData: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.TASK}>
                    {name}
                </WfoProductBlockBadge>
            ),
            width: '300px',
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            width: '700px',
            renderData: (value, row) => (
                <WfoMetadataDescriptionField
                    onSave={(updatedNote) =>
                        updateWorkflow({
                            id: row.workflowId,
                            description: updatedNote,
                        })
                    }
                    description={value}
                />
            ),
        },
        target: {
            columnType: ColumnType.DATA,
            label: t('target'),
            renderData: (target) => <WfoWorkflowTargetBadge target={target} />,
            width: '100px',
        },
        productTags: {
            columnType: ColumnType.DATA,
            label: t('productTags'),
            width: '250px',
            renderData: (productTags) => (
                <>
                    {productTags
                        ?.filter(onlyUnique)
                        .map((productTag, index) => (
                            <WfoProductBlockBadge
                                key={index}
                                link={getQueryUrl(
                                    PATH_METADATA_PRODUCTS,
                                    `tag:"${productTag}"`,
                                )}
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
                                link={getQueryUrl(
                                    PATH_METADATA_PRODUCTS,
                                    `tag:"${productTag}"`,
                                )}
                                badgeType={BadgeType.PRODUCT_TAG}
                            >
                                {productTag}
                            </WfoProductBlockBadge>
                        ))}
                </EuiBadgeGroup>
            ),
            renderTooltip: (productTags) => {
                return productTags
                    ?.filter(onlyUnique)
                    .sort((tagA, tagB) => tagA.localeCompare(tagB))
                    .map((productTag) => (
                        <p key={productTag}>- {productTag}</p>
                    ));
            },
        },
        scheduleFrequency: {
            columnType: ColumnType.DATA,
            label: t('scheduled'),
            renderData: (_, taskListItem) => (
                <WfoScheduledTasksBadgesContainer
                    workflowId={taskListItem.workflowId}
                />
            ),
            width: '80px',
        },
        createdAt: {
            columnType: ColumnType.DATA,
            label: t('createdAt'),
            width: '150px',
            renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
            renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
        },
        addSchedule: {
            columnType: ColumnType.CONTROL,
            width: '80px',
            renderControl: (taskListItem) => (
                <ScheduleTaskPopoverMenu workflowId={taskListItem.workflowId} />
            ),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;

    const taskListQueryVariables: GraphqlQueryVariables<TaskDefinition> = {
        first: pageSize,
        after: pageIndex * pageSize,
        sortBy: graphQlTaskListMapper(sortBy),
        query: queryString || undefined,
    };

    const { data, isFetching, error } = useGetTasksQuery(
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
        onChangePage: getPageIndexChangeHandler(setDataDisplayParam),
        onChangeItemsPerPage: getPageSizeChangeHandler(setDataDisplayParam),
    };

    const mapToExportItems = (
        tasksResponse: TasksResponse,
    ): TaskListExportItem[] => {
        const { tasks } = tasksResponse;

        return tasks.map(
            ({
                workflowId,
                name,
                target,
                description,
                createdAt,
                products,
            }) => {
                return {
                    workflowId,
                    name,
                    target,
                    description,
                    createdAt,
                    productTags: getConcatenatedResult(products, ['tag']),
                };
            },
        );
    };

    return (
        <WfoMetadataPageLayout>
            <WfoAdvancedTable
                data={data ? mapTaskDefinitionToTaskListItem(data.tasks) : []}
                tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={[dataSorting]}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSorting={getDataSortHandler<TaskListItem>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<TaskListItem>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                error={mapRtkErrorToWfoError(error)}
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
