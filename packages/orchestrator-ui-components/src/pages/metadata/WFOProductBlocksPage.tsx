import React from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY,
} from '../../components';
import {
    WFOSubscriptionStatusBadge,
    WFOProductBlockBadge,
    WFOTableWithFilter,
} from '../../components';
import {
    getTableConfigFromLocalStorage,
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';

import {
    defaultHiddenColumnsProductblocks
} from './tableConfig';

import { getFirstUuidPart } from '../../utils/uuid';

import { parseDateToLocaleString } from '../../utils';

import type { ProductBlockDefinition } from '../../types';
import { SortOrder } from '../../types';

import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';

import { GET_PRODUCTS_BLOCKS_GRAPHQL_QUERY } from '../../graphqlQueries';

import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';

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

export const WFOProductBlocksPage = () => {
    const t = useTranslations('metadata.productBlocks');

    const initialPageSize =
        getTableConfigFromLocalStorage(
            METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY,
        )?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProductBlockDefinition>({
            pageSize: initialPageSize,
            sortBy: {
                field: PRODUCT_BLOCK_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WFOTableColumns<ProductBlockDefinition> = {
        productBlockId: {
            field: PRODUCT_BLOCK_FIELD_ID,
            name: t('id'),
            width: '90',
            render: (value) => getFirstUuidPart(value),
            renderDetails: (value) => value,
        },
        name: {
            field: PRODUCT_BLOCK_FIELD_NAME,
            name: t('name'),
            width: '200',
        },
        description: {
            field: PRODUCT_BLOCK_FIELD_DESCRIPTION,
            name: t('description'),
            width: '400',
        },
        tag: {
            field: PRODUCT_BLOCK_FIELD_TAG,
            name: t('tag'),
            width: '90',
        },
        status: {
            field: PRODUCT_BLOCK_FIELD_STATUS,
            name: t('status'),
            width: '90',
            render: (value) => (
                <WFOSubscriptionStatusBadge
                    status={value.toLocaleLowerCase()}
                />
            ),
        },
        resourceTypes: {
            field: PRODUCT_BLOCK_FIELD_RESOURCE_TYPES,
            name: t('resourceTypes'),
            render: (resourceTypes) => (
                <>
                    {resourceTypes.map((resourceType, index) => (
                        <WFOProductBlockBadge key={index}>
                            {resourceType.resourceType}
                        </WFOProductBlockBadge>
                    ))}
                </>
            ),
        },
        createdAt: {
            field: PRODUCT_BLOCK_FIELD_CREATED_AT,
            name: t('createdAt'),
            render: parseDateToLocaleString,
        },
        endDate: {
            field: PRODUCT_BLOCK_FIELD_END_DATE,
            name: t('endDate'),
            render: parseDateToLocaleString,
        },
    };

    const { data, isFetching } = useQueryWithGraphql(
        GET_PRODUCTS_BLOCKS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: dataDisplayParams.sortBy,
        },
        'productBlocks',
        true,
    );

    const dataSorting: WFODataSorting<ProductBlockDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? PRODUCT_BLOCK_FIELD_NAME,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const totalItems = data?.productBlocks.pageInfo.totalItems;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WFOMetadataPageLayout>
            <WFOTableWithFilter<ProductBlockDefinition>
                data={data ? data.productBlocks.page : []}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                defaultHiddenColumns={defaultHiddenColumnsProductblocks}
                onUpdateDataSort={getDataSortHandler<ProductBlockDefinition>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ProductBlockDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateEsQueryString={getEsQueryStringHandler<ProductBlockDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                esQueryString={dataDisplayParams.esQueryString}
                localStorageKey={METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY}
            />
        </WFOMetadataPageLayout>
    );
};
