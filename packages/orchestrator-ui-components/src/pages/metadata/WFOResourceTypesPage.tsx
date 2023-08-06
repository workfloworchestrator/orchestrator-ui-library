import React from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_RESOURCETYPES_TABLE_LOCAL_STORAGE_KEY,
    WFOProductBlockBadge,
} from '../../components';
import { TableWithFilter } from '../../components';
import {
    getTableConfigFromLocalStorage,
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { TableColumns, DataSorting } from '../../components';

import type { ResourceTypeDefinition } from '../../types';
import { SortOrder } from '../../types';

import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';

import { GET_RESOURCE_TYPES_GRAPHQL_QUERY } from '../../graphqlQueries';

import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';

export const RESOURCE_TYPE_FIELD_ID: keyof ResourceTypeDefinition =
    'resourceTypeId';
export const RESOURCE_TYPE_FIELD_RESOURCE_TYPE: keyof ResourceTypeDefinition =
    'resourceType';

export const RESOURCE_TYPE_FIELD_DESCRIPTION: keyof ResourceTypeDefinition =
    'description';

export const RESOURCE_TYPE_FIELD_PRODUCT_BLOCKS: keyof ResourceTypeDefinition =
    'productBlocks';

export const WFOResourceTypesPage = () => {
    const t = useTranslations('metadata.resourceTypes');

    const initialPageSize =
        getTableConfigFromLocalStorage(
            METADATA_RESOURCETYPES_TABLE_LOCAL_STORAGE_KEY,
        )?.selectedPageSize ?? DEFAULT_PAGE_SIZE;

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ResourceTypeDefinition>({
            pageSize: initialPageSize,
            sortBy: {
                field: RESOURCE_TYPE_FIELD_RESOURCE_TYPE,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: TableColumns<ResourceTypeDefinition> = {
        resourceTypeId: {
            field: RESOURCE_TYPE_FIELD_ID,
            name: t('resourceTypeId'),
            width: '50',
        },
        resourceType: {
            field: RESOURCE_TYPE_FIELD_RESOURCE_TYPE,
            name: t('resourceType'),
            width: '100',
        },
        description: {
            field: RESOURCE_TYPE_FIELD_DESCRIPTION,
            name: t('description'),
            width: '300',
        },
        //TODO:
        productBlocks: {
            field: RESOURCE_TYPE_FIELD_PRODUCT_BLOCKS,
            name: t('productBlocks'),
            width: '200',
            render: (productBlocks) => (
                <>
                    {productBlocks &&
                        productBlocks.map((productBlock, index) => (
                            <WFOProductBlockBadge key={index}>
                                {productBlock.name}
                            </WFOProductBlockBadge>
                        ))}
                </>
            ),
        },
    };

    const { data, isFetching } = useQueryWithGraphql(
        GET_RESOURCE_TYPES_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: dataDisplayParams.sortBy,
        },
        'resourceTypes',
        true,
    );

    const dataSorting: DataSorting<ResourceTypeDefinition> = {
        field:
            dataDisplayParams.sortBy?.field ??
            RESOURCE_TYPE_FIELD_RESOURCE_TYPE,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const totalItems = data?.resourceTypes.pageInfo.totalItems;

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WFOMetadataPageLayout>
            <TableWithFilter<ResourceTypeDefinition>
                data={data ? data.resourceTypes.page : []}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                onUpdateDataSort={getDataSortHandler<ResourceTypeDefinition>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateEsQueryString={getEsQueryStringHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                esQueryString={dataDisplayParams.esQueryString}
                localStorageKey={METADATA_RESOURCETYPES_TABLE_LOCAL_STORAGE_KEY}
            />
        </WFOMetadataPageLayout>
    );
};
