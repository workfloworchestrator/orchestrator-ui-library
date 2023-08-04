import React from 'react';
import {
    SortOrder,
    TableWithFilter,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    WFOStatusBadge,
    WFOProductBlockBadge,
    useQueryWithGraphql,
    getTypedFieldFromObject,
} from '@orchestrator-ui/orchestrator-ui-components';

import type {
    DataDisplayParams,
    ProductDefinition,
} from '@orchestrator-ui/orchestrator-ui-components';

import {
    TableColumns,
    DataSorting,
    DEFAULT_PAGE_SIZES,
} from '@orchestrator-ui/orchestrator-ui-components';

import { FC } from 'react';
import { Pagination } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { GET_PRODUCTS_GRAPHQL_QUERY } from './productsQuery';

import { METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY } from '../../../constants';
import { useRouter } from 'next/router';
import { mapToGraphQlSortBy } from '../../../utils/queryVarsMappers';

export const PRODUCT_FIELD_PRODUCT_ID: keyof ProductDefinition = 'productId';
export const PRODUCT_FIELD_NAME: keyof ProductDefinition = 'name';
export const PRODUCT_FIELD_DESCRIPTION: keyof ProductDefinition = 'description';
export const PRODUCT_FIELD_TAG: keyof ProductDefinition = 'tag';
export const PRODUCT_FIELD_PRODUCT_TYPE: keyof ProductDefinition =
    'productType';
export const PRODUCT_FIELD_STATUS: keyof ProductDefinition = 'status';
export const PRODUCT_FIELD_PRODUCT_BLOCKS: keyof ProductDefinition =
    'productBlocks';
export const PRODUCT_FIELD_FIXED_INPUTS: keyof ProductDefinition =
    'fixedInputs';
export const PRODUCT_FIELD_CREATED_AT: keyof ProductDefinition = 'createdAt';

export type ProductsProps = {
    dataDisplayParams: DataDisplayParams<ProductDefinition>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<ProductDefinition>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<ProductDefinition>[DisplayParamKey],
    ) => void;
};

export const Products: FC<ProductsProps> = ({
    dataDisplayParams,
    setDataDisplayParam,
}) => {
    const router = useRouter();
    const t = useTranslations('metadata.product');
    const tableColumns: TableColumns<ProductDefinition> = {
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

    const sortBy = mapToGraphQlSortBy<ProductDefinition>(
        dataDisplayParams.sortBy,
    );
    const { data, isFetching } = useQueryWithGraphql(
        GET_PRODUCTS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
        },
        'products',
        true,
    );

    const sortedColumnId = getTypedFieldFromObject(sortBy?.field, tableColumns);
    if (!sortedColumnId) {
        router.replace('/metadata/products');
        return null;
    }

    const totalItems = data?.products.pageInfo.totalItems;
    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    const dataSorting: DataSorting<ProductDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? PRODUCT_FIELD_NAME,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    return (
        <TableWithFilter<ProductDefinition>
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
    );
};
