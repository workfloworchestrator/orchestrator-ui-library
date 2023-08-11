import { ProcessDefinition } from '../../types';
import { WFOFilterTab } from '../../components';

export enum WFOProcessListTabType {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

export const defaultProcessListTabs: WFOFilterTab<
    WFOProcessListTabType,
    ProcessDefinition
>[] = [
    {
        id: WFOProcessListTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'created-running-suspended-waiting-failed-resumed',
            },
        ],
    },
    {
        id: WFOProcessListTabType.COMPLETED,
        translationKey: 'completed',
        alwaysOnFilters: [
            {
                field: 'status',
                value: 'completed',
            },
        ],
    },
];
