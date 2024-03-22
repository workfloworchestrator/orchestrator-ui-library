import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY,
    StoredTableConfig,
    WfoDataSorting,
    WfoDateTime,
    WfoFirstPartUUID,
    WfoProductBlockBadge,
    WfoProductStatusBadge,
    WfoTableColumns,
    WfoTableWithFilter,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
    mapSortableAndFilterableValuesToTableColumnConfig,
} from '@/components';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import { useGetProductBlocksQuery, useLazyGetProductBlocksQuery } from '@/rtk';
import type { ProductBlocksResponse } from '@/rtk';
import {
    BadgeType,
    GraphqlQueryVariables,
    ProductBlockDefinition,
    SortOrder,
} from '@/types';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
    getQueryVariablesForExport,
    parseDateToLocaleDateTimeString,
    parseIsoString,
    resultFlattener,
} from '@/utils';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

const PRODUCT_BLOCK_FIELD_ID: keyof ProductBlockDefinition = 'productBlockId';
const PRODUCT_BLOCK_FIELD_NAME: keyof ProductBlockDefinition = 'name';

const PRODUCT_BLOCK_FIELD_TAG: keyof ProductBlockDefinition = 'tag';
const PRODUCT_BLOCK_FIELD_DESCRIPTION: keyof ProductBlockDefinition =
    'description';
const PRODUCT_BLOCK_FIELD_STATUS: keyof ProductBlockDefinition = 'status';
const PRODUCT_BLOCK_FIELD_CREATED_AT: keyof ProductBlockDefinition =
    'createdAt';
const PRODUCT_BLOCK_FIELD_END_DATE: keyof ProductBlockDefinition = 'endDate';
const PRODUCT_BLOCK_FIELD_RESOURCE_TYPES: keyof ProductBlockDefinition =
    'resourceTypes';
const PRODUCT_BLOCK_FIELD_PRODUCT_BLOCKS: keyof ProductBlockDefinition =
    'dependsOn';

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

    const tableColumns: WfoTableColumns<ProductBlockDefinition> = {
        productBlockId: {
            field: PRODUCT_BLOCK_FIELD_ID,
            name: t('id'),
            width: '90',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        name: {
            field: PRODUCT_BLOCK_FIELD_NAME,
            name: t('name'),
            width: '200',
            render: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.PRODUCT_BLOCK}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        tag: {
            field: PRODUCT_BLOCK_FIELD_TAG,
            name: t('tag'),
            width: '140',
        },
        description: {
            field: PRODUCT_BLOCK_FIELD_DESCRIPTION,
            name: t('description'),
            width: '400',
        },
        status: {
            field: PRODUCT_BLOCK_FIELD_STATUS,
            name: t('status'),
            width: '90',
            render: (value) => <WfoProductStatusBadge status={value} />,
        },
        dependsOn: {
            field: PRODUCT_BLOCK_FIELD_PRODUCT_BLOCKS,
            name: t('dependingProductBlocks'),
            render: (dependsOn) => (
                <>
                    {dependsOn.map((productBlock, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {productBlock.name}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
        },
        resourceTypes: {
            field: PRODUCT_BLOCK_FIELD_RESOURCE_TYPES,
            name: t('resourceTypes'),
            render: (resourceTypes) => (
                <>
                    {resourceTypes.map((resourceType, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.RESOURCE_TYPE}
                        >
                            {resourceType.resourceType}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (resourceTypes) => (
                <EuiBadgeGroup gutterSize="s">
                    {resourceTypes.map((resourceType, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.RESOURCE_TYPE}
                        >
                            {resourceType.resourceType}
                        </WfoProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
        },
        createdAt: {
            field: PRODUCT_BLOCK_FIELD_CREATED_AT,
            name: t('createdAt'),
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
        endDate: {
            field: PRODUCT_BLOCK_FIELD_END_DATE,
            name: t('endDate'),
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
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
    const { data, isFetching, isError } = useGetProductBlocksQuery(
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
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    const mapToExportItems = (
        productBlocksResponse: ProductBlocksResponse,
    ): ProductBlockDefinitionExportItem[] => {
        const { productBlocks } = productBlocksResponse;
        return productBlocks.map((productBlock) => ({
            ...productBlock,
            resourceTypes: resultFlattener(productBlock.resourceTypes, [
                'resourceType',
                'description',
            ]),
            dependsOn: resultFlattener(productBlock.dependsOn, ['name']),
        }));
    };

    return (
        <WfoMetadataPageLayout>
            <WfoTableWithFilter<ProductBlockDefinition>
                data={data?.productBlocks || []}
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<ProductBlockDefinition>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ProductBlockDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ProductBlockDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                hasError={isError}
                queryString={queryString}
                localStorageKey={
                    METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY
                }
                onExportData={csvDownloadHandler<
                    ProductBlocksResponse,
                    ProductBlockDefinitionExportItem
                >(
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
