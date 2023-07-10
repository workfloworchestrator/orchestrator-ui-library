import {
    Table,
    getDataSortHandler,
    getPageSizeHandler,
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

import {
    useStringQueryWithGraphql,
    determinePageIndex,
} from '@orchestrator-ui/orchestrator-ui-components';

import { FC } from 'react';
import { EuiSpacer } from '@elastic/eui';
import { Pagination } from '@elastic/eui';

import { ProductsResult, GET_PRODUCTS_GRAPHQL_QUERY } from './productsQuery';

export const PRODUCT_FIELD_NAME: keyof Product = 'name';
export const PRODUCT_FIELD_DESCRIPTION: keyof Product = 'description';
export const PRODUCT_FIELD_TAG: keyof Product = 'tag';
export const PRODUCT_FIELD_PRODUCT_TYPE: keyof Product = 'productType';
export const PRODUCT_FIELD_STATUS: keyof Product = 'status';
export const PRODUCT_FIELD_PRODUCT_BLOCKS: keyof Product = 'productBlocks';
export const PRODUCT_FIELD_CREATED_AT: keyof Product = 'createdAt';

const COLUMN_LABEL_NAME = 'Name';
const COLUMN_LABEL_DESCRIPTION = 'Description';
const COLUMN_LABEL_TAG = 'Tag';
const COLUMN_LABEL_PRODUCT_TYPE = 'Type';
const COLUMN_LABEL_STATUS = 'Status';
const COLUMN_LABEL_PRODUCT_BLOCKS = 'Product blocks';
const COLUMN_LABEL_CREATED_AT = 'Created';

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
    const hiddenColumns: Array<keyof Product> = [];

    const tableColumns: TableColumns<Product> = {
        name: {
            field: PRODUCT_FIELD_NAME,
            name: COLUMN_LABEL_NAME,
            width: '110',
        },
        description: {
            field: PRODUCT_FIELD_DESCRIPTION,
            name: COLUMN_LABEL_DESCRIPTION,
            width: '400',
        },
        tag: {
            field: PRODUCT_FIELD_TAG,
            name: COLUMN_LABEL_TAG,
        },
        productType: {
            field: PRODUCT_FIELD_PRODUCT_TYPE,
            name: COLUMN_LABEL_PRODUCT_TYPE,
        },
        status: {
            field: PRODUCT_FIELD_STATUS,
            name: COLUMN_LABEL_STATUS,
        },
        productBlocks: {
            field: PRODUCT_FIELD_PRODUCT_BLOCKS,
            name: COLUMN_LABEL_PRODUCT_BLOCKS,
        },
        createdAt: {
            field: PRODUCT_FIELD_CREATED_AT,
            name: COLUMN_LABEL_CREATED_AT,
        },
    };

    const { data, isFetching } = useStringQueryWithGraphql<
        ProductsResult,
        GraphqlQueryVariables<Product>
    >(
        GET_PRODUCTS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex,
            sortBy: dataDisplayParams.sortBy,
            filterBy: dataDisplayParams.filterBy,
        },
        'products',
        true,
    );

    const totalItemCount = data
        ? parseInt(data.products.pageInfo.totalItems)
        : 0;

    const dataSorting: DataSorting<Product> = {
        columnId: dataDisplayParams.sortBy?.field,
        sortDirection: dataDisplayParams.sortBy?.order,
    };

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: determinePageIndex(
            dataDisplayParams.pageIndex,
            dataDisplayParams.pageSize,
        ),
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItemCount,
    };

    return (
        <>
            <EuiSpacer size="m" />
            <Table
                data={data ? mapApiResponseToSubscriptionTableData(data) : []}
                columns={tableColumns}
                hiddenColumns={hiddenColumns}
                dataSorting={dataSorting}
                onDataSort={getDataSortHandler<Product>(
                    dataDisplayParams,
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                onCriteriaChange={getPageSizeHandler<Product>(
                    setDataDisplayParam,
                )}
            />
        </>
    );
};

function mapApiResponseToSubscriptionTableData(
    graphqlResponse: ProductsResult,
): Product[] {
    return graphqlResponse.products.page.map((product): Product => {
        const {
            description,
            name,
            tag,
            productType,
            status,
            productBlocks,
            createdAt,
        } = product;

        return {
            description,
            name,
            tag,
            productType,
            status,
            productBlocks,
            createdAt,
        };
    });
}
