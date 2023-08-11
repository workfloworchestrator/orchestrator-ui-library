import { TableColumnKeys } from '../../components';
import { ProcessDefinition } from '../../types';

export const defaultHiddenColumnsActiveProcesses: TableColumnKeys<ProcessDefinition> =
    ['product', 'customer', 'createdBy', 'assignee', 'id'];

export const defaultHiddenColumnsCompletedProcesses: TableColumnKeys<ProcessDefinition> =
    [
        'lastStep',
        'status',
        'product',
        'customer',
        'createdBy',
        'assignee',
        'id',
        'started',
    ];
