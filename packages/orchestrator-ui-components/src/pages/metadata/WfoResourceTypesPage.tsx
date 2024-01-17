import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';
import type { Pagination } from '@elastic/eui/src/components';

import { getQueryVariablesForExport } from '@/utils';
import { csvDownloadHandler } from '@/utils/csvDownload';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    WfoProductBlockBadge,
} from '../../components';
import type { WfoDataSorting, WfoTableColumns } from '../../components';
import { WfoTableWithFilter } from '../../components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '../../components';
import type { StoredTableConfig } from '../../components';
import { WfoFirstPartUUID } from '../../components/WfoTable/WfoFirstPartUUID';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '../../components/WfoTable/utils/mapSortableAndFilterableValuesToTableColumnConfig';
import { GET_RESOURCE_TYPES_GRAPHQL_QUERY } from '../../graphqlQueries';
import {
    useDataDisplayParams,
    useQueryWithGraphql,
    useQueryWithGraphqlLazy,
    useStoredTableConfig,
} from '../../hooks';
import type {
    GraphqlQueryVariables,
    ResourceTypeDefinition,
} from '../../types';
import { BadgeType, SortOrder } from '../../types';
import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

export const RESOURCE_TYPE_FIELD_ID: keyof ResourceTypeDefinition =
    'resourceTypeId';
export const RESOURCE_TYPE_FIELD_TYPE: keyof ResourceTypeDefinition =
    'resourceType';
export const RESOURCE_TYPE_FIELD_DESCRIPTION: keyof ResourceTypeDefinition =
    'description';
export const RESOURCE_TYPE_FIELD_PRODUCT_BLOCKS: keyof ResourceTypeDefinition =
    'productBlocks';

export const WfoResourceTypesPage = () => {
    const t = useTranslations('metadata.resourceTypes');

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ResourceTypeDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ResourceTypeDefinition>(
        METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ResourceTypeDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: RESOURCE_TYPE_FIELD_TYPE,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoTableColumns<ResourceTypeDefinition> = {
        resourceTypeId: {
            field: RESOURCE_TYPE_FIELD_ID,
            name: t('resourceId'),
            width: '90',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        resourceType: {
            field: RESOURCE_TYPE_FIELD_TYPE,
            name: t('type'),
            width: '200',
            render: (value) => (
                <WfoProductBlockBadge badgeType={BadgeType.RESOURCE_TYPE}>
                    {value}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: RESOURCE_TYPE_FIELD_DESCRIPTION,
            name: t('description'),
        },
        productBlocks: {
            field: RESOURCE_TYPE_FIELD_PRODUCT_BLOCKS,
            name: t('usedInProductBlocks'),
            render: (productBlocks) => (
                <>
                    {productBlocks.map((productBlock, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {productBlock.name}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (productBlocks) => (
                <EuiBadgeGroup gutterSize="s">
                    {productBlocks.map((productBlock, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {productBlock.name}
                        </WfoProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const graphqlQueryVariables: GraphqlQueryVariables<ResourceTypeDefinition> =
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: sortBy,
            query: queryString || undefined,
        };
    const { data, isLoading, isError } = useQueryWithGraphql(
        GET_RESOURCE_TYPES_GRAPHQL_QUERY,
        graphqlQueryVariables,
        ['resourceTypes', 'listPage'],
    );
    const { getData: getResourceTypesForExport, isFetching: isFetchingCsv } =
        useQueryWithGraphqlLazy(
            GET_RESOURCE_TYPES_GRAPHQL_QUERY,
            getQueryVariablesForExport(graphqlQueryVariables),
            ['resourceTypes', 'export'],
        );

    const dataSorting: WfoDataSorting<ResourceTypeDefinition> = {
        field: sortBy?.field ?? RESOURCE_TYPE_FIELD_TYPE,
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const { totalItems, sortFields, filterFields } =
        data?.resourceTypes?.pageInfo || {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WfoMetadataPageLayout>
            <WfoTableWithFilter<ResourceTypeDefinition>
                data={data ? data.resourceTypes.page : []}
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isLoading}
                hasError={isError}
                queryString={queryString}
                localStorageKey={
                    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY
                }
                onExportData={csvDownloadHandler(
                    getResourceTypesForExport,
                    (data) => data.resourceTypes.page,
                    'ResourceTypes.csv',
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
};
