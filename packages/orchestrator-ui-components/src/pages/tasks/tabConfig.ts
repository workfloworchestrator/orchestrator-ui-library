import { WfoProcessListTab } from '@/components';
import { ProcessActiveStatuses, ProcessDoneStatuses } from '@/types';

export enum WfoTasksListTabType {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export const defaultTasksListTabs: WfoProcessListTab<WfoTasksListTabType>[] = [
  {
    id: WfoTasksListTabType.ACTIVE,
    translationKey: 'active',
    statuses: ProcessActiveStatuses,
  },
  {
    id: WfoTasksListTabType.COMPLETED,
    translationKey: 'completed',
    statuses: ProcessDoneStatuses,
  },
];
