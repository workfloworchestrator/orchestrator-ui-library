import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    PATH_METADATA_PRODUCT_BLOCKS,
    WfoProductBlockBadge,
    getDataSortHandler,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
    getQueryStringHandler,
} from '@/components';
import type { StoredTableConfig, WfoDataSorting } from '@/components';
import { WfoFirstPartUUID } from '@/components';
import { WfoMetadataDescriptionField } from '@/components/WfoMetadata/WfoMetadataDescriptionField';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { ColumnType, Pagination } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import {
    ResourceTypesResponse,
    useGetResourceTypesQuery,
    useLazyGetResourceTypesQuery,
    useUpdateResourceTypeMutation,
} from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import {
    BadgeType,
    GraphqlQueryVariables,
    ResourceTypeDefinition,
    SortOrder,
} from '@/types';
import {
    getConcatenatedResult,
    getQueryUrl,
    getQueryVariablesForExport,
} from '@/utils';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@/utils/csvDownload';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

export const RESOURCE_TYPE_FIELD_TYPE: keyof ResourceTypeDefinition =
    'resourceType';

type ResourceTypeExportItem = Omit<ResourceTypeDefinition, 'productBlocks'> & {
    productBlocks: string;
};

export const WfoResourceTypesPage = () => {
    const t = useTranslations('metadata.resourceTypes');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();
    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ResourceTypeDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ResourceTypeDefinition>(
        METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    );
    const [updateResourceType] = useUpdateResourceTypeMutation();

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

    const tableColumns: WfoAdvancedTableColumnConfig<ResourceTypeDefinition> = {
        resourceTypeId: {
            columnType: ColumnType.DATA,
            label: t('resourceId'),
            width: '90px',
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
            renderTooltip: (value) => value,
        },
        resourceType: {
            columnType: ColumnType.DATA,
            label: t('type'),
            width: '225px',
            renderData: (value) => (
                <WfoProductBlockBadge badgeType={BadgeType.RESOURCE_TYPE}>
                    {value}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            width: '700px',
            renderData: (value, row) => (
                <WfoMetadataDescriptionField
                    onSave={(updatedNote) =>
                        updateResourceType({
                            id: row.resourceTypeId,
                            description: updatedNote,
                        })
                    }
                    description={value}
                />
            ),
        },
        productBlocks: {
            columnType: ColumnType.DATA,
            label: t('usedInProductBlocks'),
            width: '1000px',
            renderData: (productBlocks) => (
                <>
                    {productBlocks.map(({ name }, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            link={getQueryUrl(
                                PATH_METADATA_PRODUCT_BLOCKS,
                                `name:"${name}"`,
                            )}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {name}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (productBlocks) => (
                <EuiBadgeGroup gutterSize="s">
                    {productBlocks.map(({ name }, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            link={getQueryUrl(
                                PATH_METADATA_PRODUCT_BLOCKS,
                                `name:"${name}"`,
                            )}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {name}
                        </WfoProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
            renderTooltip: (productBlocks) => {
                return productBlocks.map((productBlock) => (
                    <p key={productBlock.name}>- {productBlock.name}</p>
                ));
            },
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
    const { data, isFetching, error } = useGetResourceTypesQuery(
        graphqlQueryVariables,
    );

    const [getResourceTypesTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetResourceTypesQuery();

    const getResourceTypesForExport = () =>
        getResourceTypesTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const dataSorting: WfoDataSorting<ResourceTypeDefinition> = {
        field: sortBy?.field ?? RESOURCE_TYPE_FIELD_TYPE,
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
        resourceTypesResponse: ResourceTypesResponse,
    ): ResourceTypeExportItem[] => {
        const { resourceTypes } = resourceTypesResponse;
        return resourceTypes.map((resourceType) => ({
            ...resourceType,
            productBlocks: getConcatenatedResult(resourceType.productBlocks, [
                'productBlockId',
                'name',
            ]),
        }));
    };
    return (
        <WfoMetadataPageLayout>
            <WfoAdvancedTable
                data={data ? data.resourceTypes : []}
                tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={[dataSorting]}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSorting={getDataSortHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                error={mapRtkErrorToWfoError(error)}
                queryString={queryString}
                localStorageKey={
                    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY
                }
                onExportData={csvDownloadHandler(
                    getResourceTypesForExport,
                    mapToExportItems,
                    (data) => data.pageInfo,
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('ResourceTypes'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
};
