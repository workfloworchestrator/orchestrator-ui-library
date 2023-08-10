import React from 'react';
import { useTranslations } from 'next-intl';
import type { Pagination } from '@elastic/eui/src/components';

import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
} from '../../components';
import { WFOTableWithFilter } from '../../components';
import {
    getTableConfigFromLocalStorage,
    getDataSortHandler,
    getPageChangeHandler,
    getEsQueryStringHandler,
} from '../../components';
import type { WFOTableColumns, WFODataSorting } from '../../components';
import { useToastMessage } from '../../hooks';
import { ToastTypes } from '../../contexts';

import type { ResourceTypeDefinition } from '../../types';
import { SortOrder } from '../../types';

import { useDataDisplayParams, useQueryWithGraphql } from '../../hooks';

import { GET_RESOURCE_TYPES_GRAPHQL_QUERY } from '../../graphqlQueries';

import { WFOMetadataPageLayout } from './WFOMetadataPageLayout';

export const RESOURCE_TYPE_FIELD_ID: keyof ResourceTypeDefinition =
    'resourceTypeId';
export const RESOURCE_TYPE_FIELD_TYPE: keyof ResourceTypeDefinition =
    'resourceType';
export const RESOURCE_TYPE_FIELD_DESCRIPTION: keyof ResourceTypeDefinition =
    'description';

export const WFOResourceTypesPage = () => {
    const t = useTranslations('metadata.resourceTypes');
    const toastMessage = useToastMessage();
    let initialPageSize = DEFAULT_PAGE_SIZE;
    try {
        initialPageSize =
            getTableConfigFromLocalStorage(
                METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
            )?.selectedPageSize || initialPageSize;
    } catch {
        toastMessage.addToast(ToastTypes.ERROR, 'TEXT', 'TITLE');
    }

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ResourceTypeDefinition>({
            pageSize: initialPageSize,
            sortBy: {
                field: RESOURCE_TYPE_FIELD_TYPE,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WFOTableColumns<ResourceTypeDefinition> = {
        resourceType: {
            field: RESOURCE_TYPE_FIELD_TYPE,
            name: t('type'),
            width: '110',
        },
        description: {
            field: RESOURCE_TYPE_FIELD_DESCRIPTION,
            name: t('description'),
            width: '400',
        },
        resourceTypeId: {
            field: RESOURCE_TYPE_FIELD_ID,
            name: t('resourceId'),
            width: '110',
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

    const dataSorting: WFODataSorting<ResourceTypeDefinition> = {
        field: dataDisplayParams.sortBy?.field ?? RESOURCE_TYPE_FIELD_TYPE,
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
            <WFOTableWithFilter<ResourceTypeDefinition>
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
                localStorageKey={
                    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY
                }
            />
        </WFOMetadataPageLayout>
    );
};
