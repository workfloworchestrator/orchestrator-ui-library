import {
    WfoFilterTab,
    WfoProcessListTabType,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    ServiceTicketDefinition,
    ServiceTicketProcessState,
} from '../../types';
export const defaultServiceTicketsListTabs: WfoFilterTab<
    WfoProcessListTabType,
    ServiceTicketDefinition
>[] = [
    {
        id: WfoProcessListTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'process_state',
                value: ServiceTicketProcessState.OPEN,
            },
            {
                field: 'process_state',
                value: ServiceTicketProcessState.OPEN_ACCEPTED,
            },
            {
                field: 'process_state',
                value: ServiceTicketProcessState.UPDATED,
            },
            {
                field: 'process_state',
                value: ServiceTicketProcessState.NEW,
            },
            {
                field: 'process_state',
                value: ServiceTicketProcessState.OPEN_RELATED,
            },
        ],
    },
    {
        id: WfoProcessListTabType.COMPLETED,
        translationKey: 'completed',
        alwaysOnFilters: [
            {
                field: 'process_state',
                value: ServiceTicketProcessState.CLOSED,
            },
            {
                field: 'process_state',
                value: ServiceTicketProcessState.ABORTED,
            },
        ],
    },
];
