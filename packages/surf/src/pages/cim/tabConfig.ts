import {
    WfoFilterTab,
    WfoProcessListTabType,
} from '@orchestrator-ui/orchestrator-ui-components';
import { ServiceTicketDefinition } from '../../types';
export const defaultServiceTicketsListTabs: WfoFilterTab<
    WfoProcessListTabType,
    ServiceTicketDefinition
>[] = [
    {
        id: WfoProcessListTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                // Todo: isTask is not a key of Process
                // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore waiting for fix in backend
                field: 'isTask',
                value: 'false',
            },
            {
                field: 'process_state',
                value: 'created-running-suspended-waiting-failed-resumed',
            },
        ],
    },
    {
        id: WfoProcessListTabType.COMPLETED,
        translationKey: 'completed',
        alwaysOnFilters: [
            {
                // Todo: isTask is not a key of Process
                // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore waiting for fix in backend
                field: 'isTask',
                value: 'false',
            },
            {
                field: 'process_state',
                value: 'completed',
            },
        ],
    },
];
