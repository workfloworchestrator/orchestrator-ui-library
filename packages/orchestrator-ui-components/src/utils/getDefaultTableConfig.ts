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

import {
    ProductBlockDefinition,
    ProductDefinition,
    WorkflowDefinition,
} from '../types';

import { SubscriptionListItem } from '../components/WFOSubscriptionsList';
import { ProcessListItem } from '../components/WFOProcessesList/WFOProcessList';

function getTableConfig<T>(
    hiddenColumns: (keyof T)[] = [],
    selectedPageSize = DEFAULT_PAGE_SIZE,
): StoredTableConfig<T> {
    return {
        selectedPageSize,
        hiddenColumns,
    };
}

export const getDefaultTableConfig = <T>(storageKey: string) => {
    switch (storageKey) {
        case METADATA_PRODUCTBLOCKS_TABLE_LOCAL_STORAGE_KEY:
            const productBlockColumns: (keyof ProductBlockDefinition)[] = [
                'productBlockId',
                'status',
                'endDate',
                'createdAt',
            ];
            return getTableConfig<T>(productBlockColumns as (keyof T)[]);

        case METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY:
            const productColumns: (keyof ProductDefinition)[] = [
                'productId',
                'productType',
                'status',
                'createdAt',
            ];
            return getTableConfig<T>(productColumns as (keyof T)[]);

        case METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY:
            const workflowColumns: (keyof WorkflowDefinition)[] = ['createdAt'];
            return getTableConfig<T>(workflowColumns as (keyof T)[]);

        case ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY:
            const activeProcessColumns: (keyof ProcessListItem)[] = [
                'productName',
                'customer',
                'createdBy',
                'assignee',
                'processId',
            ];
            return getTableConfig<T>(activeProcessColumns as (keyof T)[]);

        case COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY:
            const completedProcessColumns: (keyof ProcessListItem)[] = [
                'lastStep',
                'lastStatus',
                'productName',
                'customer',
                'createdBy',
                'assignee',
                'processId',
                'startedAt',
            ];
            return getTableConfig<T>(completedProcessColumns as (keyof T)[]);
        case SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY:
            const subscriptionColumns: (keyof SubscriptionListItem)[] = [
                'productName',
            ];
            return getTableConfig<T>(subscriptionColumns as (keyof T)[]);
        case METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY:
        default:
            return getTableConfig();
    }
};
