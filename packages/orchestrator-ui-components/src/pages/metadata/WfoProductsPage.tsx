import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    PATH_METADATA_PRODUCT_BLOCKS,
    WfoDataSorting,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    StoredTableConfig,
    WfoDateTime,
    WfoProductBlockBadge,
    WfoProductStatusBadge,
    getDataSortHandler,
    getQueryStringHandler,
} from '@/components';
import { WfoMetadataDescriptionField } from '@/components/WfoMetadata/WfoMetadataDescriptionField';
import { WfoAdvancedTable } from '@/components/WfoTable/WfoAdvancedTable';
import { WfoAdvancedTableColumnConfig } from '@/components/WfoTable/WfoAdvancedTable/types';
import { WfoFirstPartUUID } from '@/components/WfoTable/WfoFirstPartUUID';
import { ColumnType, Pagination } from '@/components/WfoTable/WfoTable';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@/components/WfoTable/WfoTable/utils';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@/hooks';
import {
    useGetProductsQuery,
    useLazyGetProductsQuery,
    useUpdateProductMutation,
} from '@/rtk';
import { ProductsResponse } from '@/rtk';
import { mapRtkErrorToWfoError } from '@/rtk/utils';
import type { GraphqlQueryVariables, ProductDefinition } from '@/types';
import { BadgeType, SortOrder } from '@/types';
import {
    getConcatenatedResult,
    getQueryUrl,
    getQueryVariablesForExport,
    parseDateToLocaleDateTimeString,
    parseIsoString,
} from '@/utils';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@/utils/csvDownload';

import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

const PRODUCT_FIELD_NAME: keyof ProductDefinition = 'name';

type ProductDefinitionExportItem = Omit<
    ProductDefinition,
    'fixedInputs' | 'productBlocks'
> & {
    fixedInputs: string;
    productBlocks: string;
};

export const WfoProductsPage = () => {
    const t = useTranslations('metadata.products');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();
    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProductDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ProductDefinition>(
        METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    );
    const [updateProduct] = useUpdateProductMutation();

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProductDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: PRODUCT_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoAdvancedTableColumnConfig<ProductDefinition> = {
        productId: {
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
            width: '200px',
            renderData: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.PRODUCT}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        tag: {
            columnType: ColumnType.DATA,
            label: t('tag'),
            width: '120px',
            renderData: (value) => (
                <WfoProductBlockBadge badgeType={BadgeType.PRODUCT_TAG}>
                    {value}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            width: '700px',
            renderData: (value, row) => (
                <WfoMetadataDescriptionField
                    onSave={(updatedNote) =>
                        updateProduct({
                            id: row.productId,
                            description: updatedNote,
                        })
                    }
                    description={value}
                />
            ),
        },
        productType: {
            columnType: ColumnType.DATA,
            label: t('productType'),
            width: '250px',
        },
        status: {
            columnType: ColumnType.DATA,
            label: t('status'),
            width: '90px',
            renderData: (value) => <WfoProductStatusBadge status={value} />,
        },
        fixedInputs: {
            columnType: ColumnType.DATA,
            label: t('fixedInputs'),
            width: '400px',
            renderData: (fixedInputs) => (
                <>
                    {fixedInputs.map((fixedInput, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.FIXED_INPUT}
                        >
                            {`${fixedInput.name}: ${fixedInput.value}`}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
            renderTooltip: (fixedInputs) => {
                return fixedInputs.map((fixedInput) => (
                    <p key={fixedInput.name}>
                        - {`${fixedInput.name}: ${fixedInput.value}`}
                    </p>
                ));
            },
        },
        productBlocks: {
            columnType: ColumnType.DATA,
            label: t('productBlocks'),
            width: '250px',
            renderData: (productBlocks) => (
                <>
                    {productBlocks.map(({ name }, index) => (
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
            renderTooltip: (productBlocks) =>
                productBlocks.map((productBlock) => (
                    <p key={productBlock.name}>- {productBlock.name}</p>
                )),
        },
        createdAt: {
            columnType: ColumnType.DATA,
            label: t('createdAt'),
            width: '90px',
            renderData: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
            renderTooltip: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const graphqlQueryVariables: GraphqlQueryVariables<ProductDefinition> = {
        first: pageSize,
        after: pageIndex * pageSize,
        sortBy: sortBy,
        query: queryString || undefined,
    };
    const { data, isFetching, error } = useGetProductsQuery(
        graphqlQueryVariables,
    );
    const [getProductsTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetProductsQuery();
    const getProductsForExport = () =>
        getProductsTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const { totalItems, sortFields, filterFields } = data?.pageInfo ?? {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
        onChangePage: getPageIndexChangeHandler(setDataDisplayParam),
        onChangeItemsPerPage: getPageSizeChangeHandler(setDataDisplayParam),
    };

    const dataSorting: WfoDataSorting<ProductDefinition> = {
        field: sortBy?.field ?? PRODUCT_FIELD_NAME,
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const mapToExportItems = ({
        products,
    }: ProductsResponse): ProductDefinitionExportItem[] =>
        products.map(
            ({
                productId,
                name,
                tag,
                description,
                productType,
                status,
                fixedInputs,
                productBlocks,
                createdAt,
            }) => ({
                productId,
                name,
                tag,
                description,
                productType,
                status,
                fixedInputs: getConcatenatedResult(fixedInputs, [
                    'name',
                    'value',
                ]),
                productBlocks: getConcatenatedResult(productBlocks, ['name']),
                createdAt,
            }),
        );

    return (
        <WfoMetadataPageLayout>
            <WfoAdvancedTable
                data={data?.products ?? []}
                tableColumnConfig={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={[dataSorting]}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSorting={getDataSortHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                error={mapRtkErrorToWfoError(error)}
                queryString={queryString}
                localStorageKey={METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY}
                onExportData={csvDownloadHandler(
                    getProductsForExport,
                    mapToExportItems,
                    (data) => data?.pageInfo || {},
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('Products'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
};
