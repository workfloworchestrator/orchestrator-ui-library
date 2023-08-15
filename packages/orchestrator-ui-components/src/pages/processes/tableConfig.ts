import { TableColumnKeys } from '../../components';
import { Process } from '../../types';

export const defaultHiddenColumnsActiveProcesses: TableColumnKeys<Process> = [
    'product',
    'customer',
    'createdBy',
    'assignee',
    'id',
];

export const defaultHiddenColumnsCompletedProcesses: TableColumnKeys<Process> =
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
