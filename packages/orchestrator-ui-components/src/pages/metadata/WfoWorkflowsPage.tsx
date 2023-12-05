import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    WfoLoading,
    WfoProductBlockBadge,
} from '../../components';
import { WfoTableWithFilter } from '../../components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '../../components';
import type { WfoDataSorting, WfoTableColumns } from '../../components';
import { StoredTableConfig } from '../../components';
import { WfoWorkflowTargetBadge } from '../../components/WfoBadges/WfoWorkflowTargetBadge';
import { WfoDateTime } from '../../components/WfoDateTime/WfoDateTime';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '../../components/WfoTable/utils/mapSortableAndFilterableValuesToTableColumnConfig';
import { GET_WORKFLOWS_GRAPHQL_QUERY } from '../../graphqlQueries/workflows/workflowsQuery';
import {
    useDataDisplayParams,
    useQueryWithGraphql,
    useStoredTableConfig,
} from '../../hooks';
import type { WorkflowDefinition } from '../../types';
import { BadgeType, SortOrder } from '../../types';
import { parseDateToLocaleDateTimeString, parseIsoString } from '../../utils';
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

export const WfoWorkflowsPage = () => {
    const t = useTranslations('metadata.workflows');

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

    const tableColumns: WfoTableColumns<WorkflowListItem> = {
        name: {
            field: 'name',
            name: t('name'),
            width: '200',
            render: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.WORKFLOW}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: 'description',
            name: t('description'),
            width: '300',
        },
        target: {
            field: 'target',
            name: t('target'),
            width: '90',
            render: (target) => <WfoWorkflowTargetBadge target={target} />,
        },
        productTags: {
            field: 'productTags',
            name: t('productTags'),
            render: (productTags) => (
                <>
                    {productTags?.map((productTag, index) => (
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
                    {productTags?.map((productTag, index) => (
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
            width: '110',
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const { data, isFetching } = useQueryWithGraphql(
        GET_WORKFLOWS_GRAPHQL_QUERY,
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: graphQlWorkflowListMapper(sortBy),
            query: queryString,
        },
        'workflows',
    );

    if (!data) {
        return <WfoLoading />;
    }

    const dataSorting: WfoDataSorting<WorkflowListItem> = {
        field: sortBy?.field ?? 'name',
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const { totalItems, sortFields, filterFields } = data.workflows.pageInfo;

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WfoMetadataPageLayout>
            <WfoTableWithFilter<WorkflowListItem>
                data={mapWorkflowDefinitionToWorkflowListItem(data)}
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                queryString={queryString}
                localStorageKey={METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY}
            />
        </WfoMetadataPageLayout>
    );
};
