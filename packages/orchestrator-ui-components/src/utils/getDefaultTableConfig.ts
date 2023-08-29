import {
    DEFAULT_PAGE_SIZE,
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY,
    METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
} from '../components';

import type { StoredTableConfig } from '../components';

export const getDefaultTableConfig = <T>(
    storageKey: string,
): StoredTableConfig<T> => {
    switch (storageKey) {
        case METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY:
            return {
                selectedPageSize: DEFAULT_PAGE_SIZE,
                hiddenColumns: [
                    'productBlockId',
                    'status',
                    'endDate',
                    'createdAt',
                ] as (keyof T)[],
            };

        case METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY:
            return {
                selectedPageSize: DEFAULT_PAGE_SIZE,
                hiddenColumns: [
                    'productId',
                    'productType',
                    'status',
                    'createdAt',
                ] as (keyof T)[],
            };

        case METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY:
            return {
                selectedPageSize: DEFAULT_PAGE_SIZE,
                hiddenColumns: ['createdAt'] as (keyof T)[],
            };

        case SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY:
        case ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY:
        case COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY:
        case METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY:
        default:
            return {
                selectedPageSize: DEFAULT_PAGE_SIZE,
                hiddenColumns: [],
            };
    }
};
