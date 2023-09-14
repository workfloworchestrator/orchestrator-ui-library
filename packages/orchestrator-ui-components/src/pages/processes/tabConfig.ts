import { WFOFilterTab } from '../../components';
import { ProcessListItem } from '../../components/WFOProcessesList/WFOProcessList';

export enum WFOProcessListTabType {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

export const defaultProcessListTabs: WFOFilterTab<
    WFOProcessListTabType,
    ProcessListItem
>[] = [
    {
        id: WFOProcessListTabType.ACTIVE,
        translationKey: 'active',
        alwaysOnFilters: [
            {
                field: 'lastStatus',
                value: 'created-running-suspended-waiting-failed-resumed',
            },
        ],
    },
    {
        id: WFOProcessListTabType.COMPLETED,
        translationKey: 'completed',
        alwaysOnFilters: [
            {
                field: 'lastStatus',
                value: 'completed',
            },
        ],
    },
];
