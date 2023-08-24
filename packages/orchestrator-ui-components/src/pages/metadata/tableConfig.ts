import { ResourceTypeDefinition } from '../../../dist';
import { TableColumnKeys } from '../../components';
import { ProductBlockDefinition, ProductDefinition, WorkflowDefinition } from '../../types';

export const defaultHiddenColumnsProducts: TableColumnKeys<ProductDefinition> = [
    'productId',
    'productType',
    'status',
    'createdAt',
];

export const defaultHiddenColumnsProductblocks: TableColumnKeys<ProductBlockDefinition> = [
    'productBlockId',
    'status',
    'endDate',
    'createdAt',
];

export const defaultHiddenColumnsWorkflows: TableColumnKeys<WorkflowDefinition> = [
    'createdAt',
];

export const defaultHiddenColumnsResourcetypes: TableColumnKeys<ResourceTypeDefinition> = [
];
