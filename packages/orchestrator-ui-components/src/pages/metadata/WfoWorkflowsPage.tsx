import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';

import {
    WfoDataSorting,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    StoredTableConfig,
    WfoDateTime,
    WfoProductBlockBadge,
    WfoWorkflowTargetBadge,
    getDataSortHandler,
    getQueryStringHandler,
} from '@/components';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable/WfoAdvancedTable';
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
import {
    WorkflowsResponse,
    useGetWorkflowsQuery,
    useLazyGetWorkflowsQuery,
} from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import type { GraphqlQueryVariables, WorkflowDefinition } from '@/types';
import { BadgeType, SortOrder } from '@/types';
import {
    getConcatenatedResult,
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
    graphQlWorkflowListMapper,
    mapWorkflowDefinitionToWorkflowListItem,
} from './workflowListObjectMapper';

export type WorkflowListItem = Pick<
    WorkflowDefinition,
    'name' | 'description' | 'target' | 'createdAt'
> & {
    productTags: string[];
};

type WorkflowListExportItem = Omit<WorkflowListItem, 'productTags'> & {
    productTags: string;
};

export const WfoWorkflowsPage = () => {
    const t = useTranslations('metadata.workflows');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<WorkflowListItem>>();

    const getStoredTableConfig = useStoredTableConfig<WorkflowListItem>(
        METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<WorkflowListItem>({
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

    const tableColumns: WfoAdvancedTableColumnConfig<WorkflowListItem> = {
        name: {
            columnType: ColumnType.DATA,
            label: t('name'),
            renderData: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.WORKFLOW}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            width: '40%',
        },
        target: {
            columnType: ColumnType.DATA,
            label: t('target'),
            renderData: (target) => <WfoWorkflowTargetBadge target={target} />,
        },
        productTags: {
            columnType: ColumnType.DATA,
            label: t('productTags'),
            width: '20%',
            renderData: (productTags) => (
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
            renderTooltip: (productTags) => {
                return productTags
                    ?.filter(onlyUnique)
                    .sort((tagA, tagB) => tagA.localeCompare(tagB))
                    .map((productTag) => (
                        <p key={productTag}>- {productTag}</p>
                    ));
            },
        },
        createdAt: {
            columnType: ColumnType.DATA,
            label: t('createdAt'),
            width: '15%',
            renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
            renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;

    const workflowListQueryVariables: GraphqlQueryVariables<WorkflowDefinition> =
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: graphQlWorkflowListMapper(sortBy),
            query: queryString || undefined,
        };
    const { data, isFetching, error } = useGetWorkflowsQuery(
        workflowListQueryVariables,
    );

    const [getWorkflowsTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetWorkflowsQuery();

    const getWorkflowsForExport = () =>
        getWorkflowsTrigger(
            getQueryVariablesForExport(workflowListQueryVariables),
        ).unwrap();

    const dataSorting: WfoDataSorting<WorkflowListItem> = {
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
        workflowsResponse: WorkflowsResponse,
    ): WorkflowListExportItem[] => {
        const { workflows } = workflowsResponse;
        return workflows.map(
            ({ name, target, description, createdAt, products }) => ({
                name,
                target,
                description,
                createdAt,
                productTags: getConcatenatedResult(products, ['tag']),
            }),
        );
    };

    return (
        <WfoMetadataPageLayout>
            <WfoAdvancedTable
                data={
                    data
                        ? mapWorkflowDefinitionToWorkflowListItem(
                              data.workflows,
                          )
                        : []
                }
                tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={[dataSorting]}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSorting={getDataSortHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                error={mapRtkErrorToWfoError(error)}
                queryString={queryString}
                localStorageKey={METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY}
                onExportData={csvDownloadHandler(
                    getWorkflowsForExport,
                    mapToExportItems,
                    (data) => data.pageInfo,
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('Workflows'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
};
