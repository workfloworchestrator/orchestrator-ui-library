import { ProcessRetryableStatuses } from '@/types';
import { listIncludesStatus } from '@/utils';

import type { ProcessListItem } from './WfoProcessesList';

export const isProcessRetryable = ({
  userPermissions,
  lastStatus,
}: Pick<ProcessListItem, 'userPermissions' | 'lastStatus'>) =>
  userPermissions?.retryAllowed === true && listIncludesStatus(ProcessRetryableStatuses, lastStatus);
