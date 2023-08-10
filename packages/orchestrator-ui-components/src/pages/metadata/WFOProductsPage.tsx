import React from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';
import NoSSR from 'react-no-ssr';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
} from '../../components';
import {
    WFOStatusBadge,
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
import { useToastMessage } from '../../hooks';
import { ToastTypes } from '../../contexts';

import type { ProductDefinition } from '../../types';
import { SortOrder } from '../../types';

import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';

import { GET_PRODUCTS_GRAPHQL_QUERY } from '../../graphqlQueries';

import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';

const PRODUCT_FIELD_PRODUCT_ID: keyof ProductDefinition = 'productId';
const PRODUCT_FIELD_NAME: keyof ProductDefinition = 'name';
const PRODUCT_FIELD_DESCRIPTION: keyof ProductDefinition = 'description';
const PRODUCT_FIELD_TAG: keyof ProductDefinition = 'tag';
const PRODUCT_FIELD_PRODUCT_TYPE: keyof ProductDefinition = 'productType';
const PRODUCT_FIELD_STATUS: keyof ProductDefinition = 'status';
const PRODUCT_FIELD_PRODUCT_BLOCKS: keyof ProductDefinition = 'productBlocks';
const PRODUCT_FIELD_FIXED_INPUTS: keyof ProductDefinition = 'fixedInputs';
const PRODUCT_FIELD_CREATED_AT: keyof ProductDefinition = 'createdAt';

export const WFOProductsPage = () => {
    const t = useTranslations('metadata.products');

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProductDefinition>({
            pageSize: 10,
            sortBy: {
                field: PRODUCT_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WFOTableColumns<ProductDefinition> = {
        productId: {
            field: PRODUCT_FIELD_PRODUCT_ID,
            name: t('id'),
            width: '110',
        },
        name: {
            field: PRODUCT_FIELD_NAME,
            name: t('name'),
            width: '110',
        },
        description: {
            field: PRODUCT_FIELD_DESCRIPTION,
            name: t('description'),
            width: '400',
        },
        tag: {
            field: PRODUCT_FIELD_TAG,
            name: t('tag'),
        },
        productType: {
            field: PRODUCT_FIELD_PRODUCT_TYPE,
            name: t('productType'),
        },
        status: {
            field: PRODUCT_FIELD_STATUS,
            name: t('status'),
            width: '90',
            render: (value) => (
                <WFOStatusBadge status={value.toLocaleLowerCase()} />
            ),
        },
        productBlocks: {
            field: PRODUCT_FIELD_PRODUCT_BLOCKS,
            name: t('productBlocks'),
            render: (productBlocks) => (
                <>
                    {productBlocks.map((block, index) => (
                        <WFOProductBlockBadge key={index}>
                            {block.name}
                        </WFOProductBlockBadge>
                    ))}
                </>
            ),
        },
        fixedInputs: {
            field: PRODUCT_FIELD_FIXED_INPUTS,
            name: t('fixedInputs'),
            render: (fixedInputs) => (
                <>
                    {fixedInputs.map((fixedInput, index) => (
                        <WFOProductBlockBadge key={index}>
                            {`${fixedInput.name}: ${fixedInput.value}`}
                        </WFOProductBlockBadge>
                    ))}
                </>
            ),
        },
        createdAt: {
            field: PRODUCT_FIELD_CREATED_AT,
            name: t('createdAt'),
        },
    };

    const { data, isFetching } = useQueryWithGraphql(
        GET_PRODUCTS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: dataDisplayParams.sortBy,
        },
        'productBlocks',
        true,
    );

    const totalItems = data?.products.pageInfo.totalItems;
    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    const dataSorting: WFODataSorting<ProductDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? PRODUCT_FIELD_NAME,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    return (
        <WFOMetadataPageLayout>
            <WFOTableWithFilter<ProductDefinition>
                data={data ? data.products.page : []}
                tableColumns={tableColumns}
                dataSorting={dataSorting}
                onUpdateDataSort={getDataSortHandler<ProductDefinition>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateEsQueryString={getEsQueryStringHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                esQueryString={dataDisplayParams.esQueryString}
                localStorageKey={METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY}
            />
        </WFOMetadataPageLayout>
    );
};
