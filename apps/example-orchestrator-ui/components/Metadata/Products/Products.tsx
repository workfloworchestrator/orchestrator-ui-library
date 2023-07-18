import {
    SortOrder,
    TableWithFilter,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    WFOStatusBadge,
    WFOProductBlockBadge,
} from '@orchestrator-ui/orchestrator-ui-components';

import type {
    DataDisplayParams,
    Product,
    GraphqlQueryVariables,
} from '@orchestrator-ui/orchestrator-ui-components';

import {
    TableColumns,
    DataSorting,
    DEFAULT_PAGE_SIZES,
} from '@orchestrator-ui/orchestrator-ui-components';

import { useStringQueryWithGraphql } from '@orchestrator-ui/orchestrator-ui-components';

import { FC } from 'react';
import { Pagination } from '@elastic/eui';

import { ProductsResult, GET_PRODUCTS_GRAPHQL_QUERY } from './productsQuery';

import { METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY } from '../../../constants';
import { useTranslations } from 'next-intl';

export const PRODUCT_FIELD_NAME: keyof Product = 'name';
export const PRODUCT_FIELD_DESCRIPTION: keyof Product = 'description';
export const PRODUCT_FIELD_TAG: keyof Product = 'tag';
export const PRODUCT_FIELD_PRODUCT_TYPE: keyof Product = 'productType';
export const PRODUCT_FIELD_STATUS: keyof Product = 'status';
export const PRODUCT_FIELD_PRODUCT_BLOCKS: keyof Product = 'productBlocks';
export const PRODUCT_FIELD_CREATED_AT: keyof Product = 'createdAt';

export type ProductsProps = {
    dataDisplayParams: DataDisplayParams<Product>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<Product>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<Product>[DisplayParamKey],
    ) => void;
};

export const Products: FC<ProductsProps> = ({
    dataDisplayParams,
    setDataDisplayParam,
}) => {
    const t = useTranslations('metadata.product');
    const hiddenColumns: Array<keyof Product> = [];

    const tableColumns: TableColumns<Product> = {
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
        createdAt: {
            field: PRODUCT_FIELD_CREATED_AT,
            name: t('createdAt'),
        },
    };

    const { data, isFetching } = useStringQueryWithGraphql<
        ProductsResult,
        GraphqlQueryVariables<Product>
    >(
        GET_PRODUCTS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy: dataDisplayParams.sortBy,
        },
        'products',
        true,
    );

    const totalItemCount = data
        ? parseInt(data.products.pageInfo.totalItems)
        : 0;

    const dataSorting: DataSorting<Product> = {
        field: dataDisplayParams.sortBy?.field ?? PRODUCT_FIELD_NAME,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItemCount,
    };

    return (
        <TableWithFilter<Product>
            data={data ? mapApiResponseToProductTableData(data) : []}
            tableColumns={tableColumns}
            defaultHiddenColumns={hiddenColumns}
            dataSorting={dataSorting}
            onUpdateDataSort={getDataSortHandler<Product>(
                dataDisplayParams,
                setDataDisplayParam,
            )}
            onUpdatePage={getPageChangeHandler<Product>(setDataDisplayParam)}
            onUpdateEsQueryString={getEsQueryStringHandler<Product>(
                setDataDisplayParam,
            )}
            pagination={pagination}
            isLoading={isFetching}
            esQueryString={dataDisplayParams.esQueryString}
            localStorageKey={METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY}
        />
    );
};

function mapApiResponseToProductTableData(
    graphqlResponse: ProductsResult,
): Product[] {
    return graphqlResponse.products.page.map(
        (product): Product => ({
            ...product,
        }),
    );
}
