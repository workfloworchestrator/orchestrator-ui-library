import { TableColumnKeys } from '../../components';
import { Process } from '../../types';

export const defaultHiddenColumnsActiveProcesses: TableColumnKeys<Process> = [
    'product',
    'customer',
    'createdBy',
    'assignee',
    'processId',
];

export const defaultHiddenColumnsCompletedProcesses: TableColumnKeys<Process> =
    [
        'step',
        'status',
        'product',
        'customer',
        'createdBy',
        'assignee',
        'processId',
        'started',
    ];
