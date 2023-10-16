import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY,
} from '../../components';
import {
    WFOProductBlockBadge,
    WFOProductStatusBadge,
    WFOTableWithFilter,
} from '../../components';
import {} from '../../components/WFOBadges/WFOProductStatusBadge';

import {
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';

import { parseDateToLocaleDateTimeString, parseIsoString } from '../../utils';
import type { ProductBlockDefinition } from '../../types';
import { BadgeType, SortOrder } from '../../types';
import type { StoredTableConfig } from '../../components';
import {
    useDataDisplayParams,
    useQueryWithGraphql,
    useStoredTableConfig,
} from '../../hooks';

import { GET_PRODUCTS_BLOCKS_GRAPHQL_QUERY } from '../../graphqlQueries';

import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';
import { EuiBadgeGroup } from '@elastic/eui';
import { WFOFirstPartUUID } from '../../components/WFOTable/WFOFirstPartUUID';
import { WFODateTime } from '../../components/WFODateTime/WFODateTime';

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

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProductBlockDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ProductBlockDefinition>(
        METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY,
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

    const tableColumns: WFOTableColumns<ProductBlockDefinition> = {
        productBlockId: {
            field: PRODUCT_BLOCK_FIELD_ID,
            name: t('id'),
            width: '90',
            render: (value) => <WFOFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        name: {
            field: PRODUCT_BLOCK_FIELD_NAME,
            name: t('name'),
            width: '200',
            render: (name) => (
                <WFOProductBlockBadge badgeType={BadgeType.PRODUCTBLOCK}>
                    {name}
                </WFOProductBlockBadge>
            ),
        },
        tag: {
            field: PRODUCT_BLOCK_FIELD_TAG,
            name: t('tag'),
            width: '180',
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
            render: (value) => <WFOProductStatusBadge status={value} />,
        },
        resourceTypes: {
            field: PRODUCT_BLOCK_FIELD_RESOURCE_TYPES,
            name: t('resourceTypes'),
            render: (resourceTypes) => (
                <>
                    {resourceTypes.map((resourceType, index) => (
                        <WFOProductBlockBadge
                            key={index}
                            badgeType={BadgeType.RESOURCETYPE}
                        >
                            {resourceType.resourceType}
                        </WFOProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (resourceTypes) => (
                <EuiBadgeGroup gutterSize="s">
                    {resourceTypes.map((resourceType, index) => (
                        <WFOProductBlockBadge
                            key={index}
                            badgeType={BadgeType.RESOURCETYPE}
                        >
                            {resourceType.resourceType}
                        </WFOProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
        },
        createdAt: {
            field: PRODUCT_BLOCK_FIELD_CREATED_AT,
            name: t('createdAt'),
            render: (date) => <WFODateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
        endDate: {
            field: PRODUCT_BLOCK_FIELD_END_DATE,
            name: t('endDate'),
            render: (date) => <WFODateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
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
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
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
