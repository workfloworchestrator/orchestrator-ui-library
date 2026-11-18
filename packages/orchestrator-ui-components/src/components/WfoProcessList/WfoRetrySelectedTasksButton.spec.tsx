import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ConfirmationDialogContext } from '@/contexts';
import { ProcessStatus, ToastTypes } from '@/types';

import type { ProcessListItem } from './WfoProcessesList';
import { WfoRetrySelectedTasksButton } from './WfoRetrySelectedTasksButton';

const mockIsAllowed = jest.fn();
const mockIsEngineRunningNow = jest.fn();
const mockShowToastMessage = jest.fn();
const mockBulkProcessAction = jest.fn();

jest.mock('@/hooks', () => ({
  usePolicy: () => ({ isAllowed: mockIsAllowed }),
  useCheckEngineStatus: () => ({ isEngineRunningNow: mockIsEngineRunningNow }),
  useShowToastMessage: () => ({ showToastMessage: mockShowToastMessage }),
}));

jest.mock('@/rtk/endpoints/processDetail', () => ({
  useBulkProcessActionMutation: () => [mockBulkProcessAction],
}));

jest.mock('@/contexts', () => {
  const { createContext } = jest.requireActual('react');
  return { ConfirmationDialogContext: createContext({ showConfirmDialog: () => {}, closeConfirmDialog: () => {} }) };
});

// The @/utils barrel imports the whole component tree, which hits a circular import in Jest
jest.mock('@/utils', () => jest.requireActual('@/utils/listIncludesStatus'));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: { count: number }) => (values ? `${key}: ${values.count}` : key),
}));

const getTask = (processId: string, lastStatus: ProcessStatus, retryAllowed = true) =>
  ({ processId, lastStatus, userPermissions: { retryAllowed, resumeAllowed: retryAllowed } }) as ProcessListItem;

const failedTask = getTask('failed-task', ProcessStatus.FAILED);
const waitingTask = getTask('waiting-task', ProcessStatus.WAITING);
const runningTask = getTask('running-task', ProcessStatus.RUNNING);
const notPermittedTask = getTask('not-permitted-task', ProcessStatus.FAILED, false);

const renderButton = (selectedTasks: ProcessListItem[]) => {
  const showConfirmDialog = jest.fn();
  const onRetryStarted = jest.fn();
  render(
    <ConfirmationDialogContext.Provider value={{ showConfirmDialog, closeConfirmDialog: jest.fn() }}>
      <WfoRetrySelectedTasksButton selectedTasks={selectedTasks} onRetryStarted={onRetryStarted} />
    </ConfirmationDialogContext.Provider>,
  );
  return { showConfirmDialog, onRetryStarted };
};

const clickAndConfirmRetry = async (showConfirmDialog: jest.Mock) => {
  fireEvent.click(screen.getByRole('button', { name: /retrySelected/ }));
  await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
  await showConfirmDialog.mock.calls[0][0].onConfirm();
};

describe('WfoRetrySelectedTasksButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAllowed.mockReturnValue(true);
    mockIsEngineRunningNow.mockResolvedValue(true);
    mockBulkProcessAction.mockImplementation(({ processIds }: { processIds: string[] }) => ({
      unwrap: () => Promise.resolve({ action: 'resume', count: processIds.length, results: [] }),
    }));
  });

  it.each([
    ['no tasks are selected', []],
    ['none of the selected tasks can be retried', [runningTask, notPermittedTask]],
  ])('is disabled when %s', (_, selectedTasks) => {
    renderButton(selectedTasks);

    expect(screen.getByRole('button', { name: /retrySelected/ })).toBeDisabled();
  });

  it('is not shown without the retry policy', () => {
    mockIsAllowed.mockReturnValue(false);
    renderButton([failedTask]);

    expect(screen.queryByRole('button', { name: /retrySelected/ })).not.toBeInTheDocument();
  });

  it('retries the selected tasks that can be retried in one bulk request and reports that the retry started', async () => {
    const { showConfirmDialog, onRetryStarted } = renderButton([
      failedTask,
      runningTask,
      waitingTask,
      notPermittedTask,
    ]);

    await clickAndConfirmRetry(showConfirmDialog);

    expect(showConfirmDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        question: 'retrySelectedQuestion: 2',
        subQuestion: 'retrySelectedSkipped: 2',
      }),
    );
    expect(mockBulkProcessAction.mock.calls).toEqual([
      [{ action: 'resume', processIds: ['failed-task', 'waiting-task'] }],
    ]);
    expect(mockShowToastMessage).toHaveBeenCalledTimes(1);
    expect(mockShowToastMessage).toHaveBeenCalledWith(
      ToastTypes.SUCCESS,
      'retrySelectedStartedText: 2',
      'retrySelectedStartedTitle',
    );
    expect(onRetryStarted).toHaveBeenCalled();
  });

  it.each([
    [
      'the error detail of the backend',
      { status: 409, data: { detail: 'waiting-task: not possible' } },
      'waiting-task: not possible',
    ],
    ['a fallback without an error detail', { status: 500, data: {} }, 'retrySelectedFailedText: 2'],
  ])('reports %s and keeps the selection when the bulk request is rejected', async (_, error, expectedText) => {
    mockBulkProcessAction.mockImplementation(() => ({ unwrap: () => Promise.reject(error) }));
    const { showConfirmDialog, onRetryStarted } = renderButton([failedTask, waitingTask]);

    await clickAndConfirmRetry(showConfirmDialog);

    expect(mockShowToastMessage).toHaveBeenCalledTimes(1);
    expect(mockShowToastMessage).toHaveBeenCalledWith(ToastTypes.ERROR, expectedText, 'retrySelectedFailedTitle');
    expect(onRetryStarted).not.toHaveBeenCalled();
  });

  it('does not ask to retry when the engine is not running', async () => {
    mockIsEngineRunningNow.mockResolvedValue(false);
    const { showConfirmDialog } = renderButton([failedTask]);

    fireEvent.click(screen.getByRole('button', { name: /retrySelected/ }));

    await waitFor(() => expect(mockIsEngineRunningNow).toHaveBeenCalled());
    expect(showConfirmDialog).not.toHaveBeenCalled();
    expect(mockBulkProcessAction).not.toHaveBeenCalled();
  });
});
