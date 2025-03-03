import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY,
    PATH_METADATA_PRODUCT_BLOCKS,
    PATH_METADATA_RESOURCE_TYPES,
    StoredTableConfig,
    WfoDataSorting,
    WfoDateTime,
    WfoFirstPartUUID,
    WfoProductBlockBadge,
    WfoProductStatusBadge,
    getDataSortHandler,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
    getQueryStringHandler,
} from '@/components';
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
    useGetProductBlocksQuery,
    useLazyGetProductBlocksQuery,
    useUpdateProductBlockMutation,
} from '@/rtk';
import type { ProductBlocksResponse } from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import {
    BadgeType,
    GraphqlQueryVariables,
    ProductBlockDefinition,
    SortOrder,
} from '@/types';
import {
    csvDownloadHandler,
    getConcatenatedResult,
    getCsvFileNameWithDate,
    getQueryUrl,
    getQueryVariablesForExport,
    parseDateToLocaleDateTimeString,
    parseIsoString,
} from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

const PRODUCT_BLOCK_FIELD_NAME: keyof ProductBlockDefinition = 'name';

type ProductBlockDefinitionExportItem = Omit<
    ProductBlockDefinition,
    'resourceTypes' | 'dependsOn'
> & {
    resourceTypes: string;
    dependsOn: string;
};

export const WfoProductBlocksPage = () => {
    const t = useTranslations('metadata.productBlocks');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProductBlockDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ProductBlockDefinition>(
        METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY,
    );
    const [updateProductBlock] = useUpdateProductBlockMutation();

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProductBlockDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: PRODUCT_BLOCK_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoAdvancedTableColumnConfig<ProductBlockDefinition> = {
        productBlockId: {
            columnType: ColumnType.DATA,
            label: t('id'),
            width: '90px',
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
            renderTooltip: (value) => value,
        },
        name: {
            columnType: ColumnType.DATA,
            label: t('name'),
            width: '300px',
            renderData: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.PRODUCT_BLOCK}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        tag: {
            columnType: ColumnType.DATA,
            label: t('tag'),
            width: '120px',
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            width: '700px',
            renderData: (value, row) => (
                <WfoMetadataDescriptionField
                    onSave={(updatedNote) =>
                        updateProductBlock({
                            id: row.productBlockId,
                            description: updatedNote,
                        })
                    }
                    description={value}
                />
            ),
        },
        status: {
            columnType: ColumnType.DATA,
            label: t('status'),
            width: '90px',
            renderData: (value) => <WfoProductStatusBadge status={value} />,
        },
        dependsOn: {
            columnType: ColumnType.DATA,
            label: t('dependingProductBlocks'),
            renderData: (dependsOn) => (
                <>
                    {dependsOn.map(({ name }, index) => (
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
            renderTooltip: (productBlocks) => {
                return productBlocks.map((productBlock) => (
                    <p key={productBlock.name}>- {productBlock.name}</p>
                ));
            },
        },
        resourceTypes: {
            columnType: ColumnType.DATA,
            label: t('resourceTypes'),
            width: '700px',
            renderData: (resourceTypes) => (
                <>
                    {resourceTypes.map(({ resourceType }, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            link={getQueryUrl(
                                PATH_METADATA_RESOURCE_TYPES,
                                `resourceType:"${resourceType}"`,
                            )}
                            badgeType={BadgeType.RESOURCE_TYPE}
                        >
                            {resourceType}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (resourceTypes) => (
                <EuiBadgeGroup gutterSize="s">
                    {resourceTypes.map(({ resourceType }, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            link={getQueryUrl(
                                PATH_METADATA_RESOURCE_TYPES,
                                `resourceType:"${resourceType}"`,
                            )}
                            badgeType={BadgeType.RESOURCE_TYPE}
                        >
                            {resourceType}
                        </WfoProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
            renderTooltip: (resourceTypes) => {
                return resourceTypes.map((resourceType) => (
                    <p key={resourceType.resourceType}>
                        - {resourceType.resourceType}
                    </p>
                ));
            },
        },
        createdAt: {
            columnType: ColumnType.DATA,
            label: t('createdAt'),
            width: '120px',
            renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
            renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
        },
        endDate: {
            columnType: ColumnType.DATA,
            label: t('endDate'),
            width: '120px',
            renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
            renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const graphqlQueryVariables: GraphqlQueryVariables<ProductBlockDefinition> =
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: sortBy,
            query: queryString || undefined,
        };
    const { data, isFetching, error } = useGetProductBlocksQuery(
        graphqlQueryVariables,
    );
    const [getProductBlocksTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetProductBlocksQuery();
    const getProductBlocksForExport = () =>
        getProductBlocksTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const dataSorting: WfoDataSorting<ProductBlockDefinition> = {
        field: sortBy?.field ?? PRODUCT_BLOCK_FIELD_NAME,
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const { totalItems, sortFields, filterFields } = data?.pageInfo ?? {};

    const pagination: Pagination = {
        pageIndex,
        pageSize,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
        onChangePage: getPageIndexChangeHandler(setDataDisplayParam),
        onChangeItemsPerPage: getPageSizeChangeHandler(setDataDisplayParam),
    };

    const mapToExportItems = (
        productBlocksResponse: ProductBlocksResponse,
    ): ProductBlockDefinitionExportItem[] => {
        const { productBlocks } = productBlocksResponse;
        return productBlocks.map((productBlock) => ({
            ...productBlock,
            resourceTypes: getConcatenatedResult(productBlock.resourceTypes, [
                'resourceType',
                'description',
            ]),
            dependsOn: getConcatenatedResult(productBlock.dependsOn, ['name']),
        }));
    };

    return (
        <WfoMetadataPageLayout>
            <WfoAdvancedTable
                data={data?.productBlocks || []}
                tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={[dataSorting]}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSorting={getDataSortHandler(setDataDisplayParam)}
                onUpdateQueryString={getQueryStringHandler<ProductBlockDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                error={mapRtkErrorToWfoError(error)}
                queryString={queryString}
                localStorageKey={
                    METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY
                }
                onExportData={csvDownloadHandler(
                    getProductBlocksForExport,
                    mapToExportItems,
                    (data) => data.pageInfo,
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('ProductBlocks'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
};
