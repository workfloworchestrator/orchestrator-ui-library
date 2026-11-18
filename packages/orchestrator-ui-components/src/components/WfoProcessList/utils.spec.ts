import { ProcessStatus } from '@/types';

import type { ProcessListItem } from './WfoProcessesList';
import { isProcessAbortable, isProcessDeletable, isProcessRetryable } from './utils';

// The @/utils barrel imports the whole component tree, which hits a circular import in Jest
jest.mock('@/utils', () => jest.requireActual('@/utils/listIncludesStatus'));

const getProcess = (lastStatus: ProcessStatus, { isTask = true, retryAllowed = true } = {}) =>
  ({ lastStatus, isTask, userPermissions: { retryAllowed, resumeAllowed: retryAllowed } }) as ProcessListItem;

describe('process list utils', () => {
  it.each([
    [ProcessStatus.FAILED, true, true],
    [ProcessStatus.WAITING, true, true],
    [ProcessStatus.API_UNAVAILABLE, true, true],
    [ProcessStatus.INCONSISTENT_DATA, true, true],
    [ProcessStatus.FAILED, false, false],
    [ProcessStatus.RUNNING, true, false],
    [ProcessStatus.SUSPENDED, true, false],
    [ProcessStatus.COMPLETED, true, false],
  ])('isProcessRetryable: %s with retryAllowed %s is %s', (lastStatus, retryAllowed, expected) => {
    expect(isProcessRetryable(getProcess(lastStatus, { retryAllowed }))).toBe(expected);
  });

  it.each([
    [ProcessStatus.RUNNING, true],
    [ProcessStatus.FAILED, true],
    [ProcessStatus.SUSPENDED, true],
    [ProcessStatus.COMPLETED, false],
    [ProcessStatus.ABORTED, false],
  ])('isProcessAbortable: %s is %s', (lastStatus, expected) => {
    expect(isProcessAbortable(getProcess(lastStatus))).toBe(expected);
  });

  it.each([
    [ProcessStatus.FAILED, true, true],
    [ProcessStatus.COMPLETED, true, true],
    [ProcessStatus.ABORTED, true, true],
    [ProcessStatus.RUNNING, true, false],
    [ProcessStatus.COMPLETED, false, false],
  ])('isProcessDeletable: %s with isTask %s is %s', (lastStatus, isTask, expected) => {
    expect(isProcessDeletable(getProcess(lastStatus, { isTask }))).toBe(expected);
  });
});
