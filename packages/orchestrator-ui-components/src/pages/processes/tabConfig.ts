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
                // Todo: isTask is not a key of Process
                // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore waiting for fix in backend
                field: 'isTask',
                value: 'false',
            },
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
                // Todo: isTask is not a key of Process
                // However, backend still supports it. Field should not be a keyof ProcessListItem (or process)
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/290
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore waiting for fix in backend
                field: 'isTask',
                value: 'false',
            },
            {
                field: 'lastStatus',
                value: 'completed',
            },
        ],
    },
];
