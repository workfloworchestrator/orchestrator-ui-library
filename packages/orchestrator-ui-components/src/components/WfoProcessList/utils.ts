import { ProcessDoneStatuses, ProcessRetryableStatuses, ProcessStatus } from '@/types';
import { listIncludesStatus } from '@/utils';

import type { ProcessListItem } from './WfoProcessesList';

export const isProcessRetryable = ({
  userPermissions,
  lastStatus,
}: Pick<ProcessListItem, 'userPermissions' | 'lastStatus'>) =>
  userPermissions?.retryAllowed === true && listIncludesStatus(ProcessRetryableStatuses, lastStatus);

export const isProcessAbortable = ({ lastStatus }: Pick<ProcessListItem, 'lastStatus'>) =>
  !listIncludesStatus(ProcessDoneStatuses, lastStatus);

export const isProcessDeletable = ({ isTask, lastStatus }: Pick<ProcessListItem, 'isTask' | 'lastStatus'>) =>
  isTask && !listIncludesStatus([ProcessStatus.RUNNING], lastStatus);
