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
    Product,
} from '@orchestrator-ui/orchestrator-ui-components';

import {
    TableColumns,
    DataSorting,
    DEFAULT_PAGE_SIZES,
} from '@orchestrator-ui/orchestrator-ui-components';

import { FC } from 'react';
import { Pagination } from '@elastic/eui';

import { GET_PRODUCTS_GRAPHQL_QUERY } from './productsQuery';

import { METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY } from '../../../constants';
import {
    MetadataProductsQuery,
    SortOrder as SortOrderGraphql,
} from '../../../__generated__/graphql';
import { useRouter } from 'next/router';

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
    const router = useRouter();

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
            width: '90',
            render: (value) => (
                <WFOStatusBadge status={value.toLocaleLowerCase()} />
            ),
        },
        productBlocks: {
            field: PRODUCT_FIELD_PRODUCT_BLOCKS,
            name: COLUMN_LABEL_PRODUCT_BLOCKS,
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
            name: COLUMN_LABEL_CREATED_AT,
        },
    };

    const sortedColumnId = dataDisplayParams.sortBy
        ? getTypedFieldFromObject(dataDisplayParams.sortBy.field, tableColumns)
        : null;

    const { data, isFetching } = useQueryWithGraphql(
        GET_PRODUCTS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            // Todo introduce a mapper utility function
            sortBy: sortedColumnId &&
                dataDisplayParams.sortBy?.order && {
                    field: sortedColumnId.toString(),
                    order:
                        dataDisplayParams.sortBy.order === 'ASC'
                            ? SortOrderGraphql.Asc
                            : SortOrderGraphql.Desc,
                },
        },
        'products',
        true,
    );

    if (!sortedColumnId) {
        router.replace('/metadata/products');
        return null;
    }

    // Todo: handle this better
    const totalItems = data?.products.pageInfo.totalItems ?? '0';
    const totalItemCount = data ? parseInt(totalItems) : 0;

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
    graphqlResponse: MetadataProductsQuery,
): Product[] {
    return graphqlResponse.products.page.map(
        (product): Product => ({
            ...product,
        }),
    );
}
