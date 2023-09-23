import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    WFOLoading,
    WFOProductBlockBadge,
} from '../../components';
import { WFOTableWithFilter } from '../../components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';

import type { WorkflowDefinition } from '../../types';
import { SortOrder } from '../../types';
import { StoredTableConfig } from '../../components';

import {
    useDataDisplayParams,
    useQueryWithGraphql,
    useStoredTableConfig,
} from '../../hooks';
import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';
import { EuiBadgeGroup } from '@elastic/eui';
import { GET_WORKFLOWS_GRAPHQL_QUERY } from '../../graphqlQueries/workflows/workflowsQuery';
import {
    graphQlWorkflowListMapper,
    mapWorkflowDefinitionToWorkflowListItem,
} from './workflowListObjectMapper';
import { WFODateTime } from '../../components/WFODateTime/WFODateTime';
import { parseIsoString, parseDateToLocaleDateTimeString } from '../../utils';

export type WorkflowListItem = Pick<
    WorkflowDefinition,
    'name' | 'description' | 'target' | 'createdAt'
> & {
    productTags: string[];
};

export const WFOWorkflowsPage = () => {
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

    const tableColumns: WFOTableColumns<WorkflowListItem> = {
        name: {
            field: 'name',
            name: t('name'),
            width: '200',
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
        },
        productTags: {
            field: 'productTags',
            name: t('productTags'),
            render: (productTags) => (
                <>
                    {productTags?.map((productTag, index) => (
                        <WFOProductBlockBadge key={index}>
                            {productTag}
                        </WFOProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (productTags) => (
                <EuiBadgeGroup gutterSize="s">
                    {productTags?.map((productTag, index) => (
                        <WFOProductBlockBadge key={index}>
                            {productTag}
                        </WFOProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
        },
        createdAt: {
            field: 'createdAt',
            name: t('createdAt'),
            width: '110',
            render: (date) => <WFODateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { data, isFetching } = useQueryWithGraphql(
        GET_WORKFLOWS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: graphQlWorkflowListMapper(dataDisplayParams.sortBy),
        },
        'workflows',
        true,
    );

    if (!data) {
        return <WFOLoading />;
    }

    const dataSorting: WFODataSorting<WorkflowListItem> = {
        field: dataDisplayParams.sortBy?.field ?? 'name',
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const totalItems = data?.workflows.pageInfo.totalItems;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WFOMetadataPageLayout>
            <WFOTableWithFilter<WorkflowListItem>
                data={mapWorkflowDefinitionToWorkflowListItem(data)}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<WorkflowListItem>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                onUpdateEsQueryString={getEsQueryStringHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                esQueryString={dataDisplayParams.esQueryString}
                localStorageKey={METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY}
            />
        </WFOMetadataPageLayout>
    );
};
