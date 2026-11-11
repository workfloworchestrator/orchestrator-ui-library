import { WfoProcessListTab } from '@/components';
import { ProcessActiveStatuses, ProcessDoneStatuses } from '@/types';

export enum WfoWorkflowsListTabType {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export const defaultWorkflowsListTabs: WfoProcessListTab<WfoWorkflowsListTabType>[] = [
  {
    id: WfoWorkflowsListTabType.ACTIVE,
    translationKey: 'active',
    statuses: ProcessActiveStatuses,
  },
  {
    id: WfoWorkflowsListTabType.COMPLETED,
    translationKey: 'completed',
    statuses: ProcessDoneStatuses,
  },
];
