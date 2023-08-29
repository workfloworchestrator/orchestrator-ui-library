import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';
import {
    WFOSubscriptionStatusBadge,
    WFOProductBlockBadge,
    WFOTableWithFilter,
} from '../../components';
import {
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';

import type { ProductDefinition } from '../../types';
import { SortOrder } from '../../types';

import {
    useDataDisplayParams,
    useQueryWithGraphql,
    useStoredTableConfig,
} from '../../hooks';

import { GET_PRODUCTS_GRAPHQL_QUERY } from '../../graphqlQueries';

import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';
import { WFOFirstPartUUID } from '../../components/WFOTable/WFOFirstPartUUID';
import { StoredTableConfig } from '../../components';

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
    const [tableDefaults, setTableDefaults] = useState<
        StoredTableConfig<ProductDefinition>
    >({
        selectedPageSize: 10,
        hiddenColumns: [],
    });
    const getStoredTableConfig = useStoredTableConfig<ProductDefinition>(
        METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, []);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProductDefinition>({
            pageSize: tableDefaults?.selectedPageSize,
            sortBy: {
                field: PRODUCT_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WFOTableColumns<ProductDefinition> = {
        productId: {
            field: PRODUCT_FIELD_PRODUCT_ID,
            name: t('id'),
            width: '90',
            render: (value) => <WFOFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        name: {
            field: PRODUCT_FIELD_NAME,
            name: t('name'),
            width: '200',
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
                <WFOSubscriptionStatusBadge
                    status={value.toLocaleLowerCase()}
                />
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
        'products',
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
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
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
