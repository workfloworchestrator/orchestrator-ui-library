import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
    METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY,
    METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    TASK_LIST_TABLE_LOCAL_STORAGE_KEY,
} from '../components';
import type { StoredTableConfig } from '../components';
import { ProcessListItem } from '../components/WfoProcessList/WfoProcessList';
import { SubscriptionListItem } from '../components/WfoSubscriptionsList';
import {
    ProductBlockDefinition,
    ProductDefinition,
    ResourceTypeDefinition,
    WorkflowDefinition,
} from '../types';

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
        case METADATA_PRODUCT_BLOCKS_TABLE_LOCAL_STORAGE_KEY:
            const productBlockColumns: (keyof ProductBlockDefinition)[] = [
                'productBlockId',
                'status',
                'endDate',
                'createdAt',
            ];
            return getTableConfig<T>(productBlockColumns as (keyof T)[]);

        case METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY:
            const resourceTypeColumns: (keyof ResourceTypeDefinition)[] = [
                'resourceTypeId',
            ];
            return getTableConfig<T>(resourceTypeColumns as (keyof T)[]);

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
        case TASK_LIST_TABLE_LOCAL_STORAGE_KEY:
            const taskColumns: (keyof ProcessListItem)[] = [
                'assignee',
                'workflowTarget',
                'productName',
                'customer',
                'processId',
            ];
            return getTableConfig<T>(taskColumns as (keyof T)[]);
        case SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY:
            const subscriptionColumns: (keyof SubscriptionListItem)[] = [
                'productName',
            ];
            return getTableConfig<T>(subscriptionColumns as (keyof T)[]);
        default:
            return getTableConfig();
    }
};
