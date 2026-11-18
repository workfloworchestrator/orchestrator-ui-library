import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { ProcessStatus, ToastTypes } from '@/types';

import { WfoBulkProcessActionButton, WfoConfirmedBulkProcessAction } from './WfoBulkProcessActionButton';
import type { ProcessListItem } from './WfoProcessesList';

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
  useBulkProcessActionMutation: () => [mockBulkProcessAction, { isLoading: false }],
}));

jest.mock('@/contexts', () => {
  const { createContext } = jest.requireActual('react');
  return { ConfirmationDialogContext: createContext({ showConfirmDialog: () => {}, closeConfirmDialog: () => {} }) };
});

// The @/utils barrel imports the whole component tree, which hits a circular import in Jest
jest.mock('@/utils', () => jest.requireActual('@/utils/listIncludesStatus'));

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string, values?: { count: number }) =>
    `${namespace}.${key}${values ? `: ${values.count}` : ''}`,
}));

const getTask = (processId: string, lastStatus: ProcessStatus, retryAllowed = true) =>
  ({
    processId,
    lastStatus,
    isTask: true,
    userPermissions: { retryAllowed, resumeAllowed: retryAllowed },
  }) as ProcessListItem;

const failedTask = getTask('failed-task', ProcessStatus.FAILED);
const waitingTask = getTask('waiting-task', ProcessStatus.WAITING);
const runningTask = getTask('running-task', ProcessStatus.RUNNING);
const notPermittedTask = getTask('not-permitted-task', ProcessStatus.FAILED, false);
const completedTask = getTask('completed-task', ProcessStatus.COMPLETED);
const abortedTask = getTask('aborted-task', ProcessStatus.ABORTED);

const allTasks = [failedTask, waitingTask, runningTask, notPermittedTask, completedTask, abortedTask];

const actionCases: {
  action: WfoConfirmedBulkProcessAction;
  policyResource: PolicyResource;
  needsRunningEngine: boolean;
  applicableTaskIds: string[];
}[] = [
  {
    action: 'resume',
    policyResource: PolicyResource.PROCESS_RETRY,
    needsRunningEngine: true,
    applicableTaskIds: ['failed-task', 'waiting-task'],
  },
  {
    action: 'abort',
    policyResource: PolicyResource.PROCESS_ABORT,
    needsRunningEngine: true,
    applicableTaskIds: ['failed-task', 'waiting-task', 'running-task', 'not-permitted-task'],
  },
  {
    action: 'delete',
    policyResource: PolicyResource.PROCESS_DELETE,
    needsRunningEngine: false,
    applicableTaskIds: ['failed-task', 'waiting-task', 'not-permitted-task', 'completed-task', 'aborted-task'],
  },
];

const renderButton = (action: WfoConfirmedBulkProcessAction, selectedProcesses: ProcessListItem[]) => {
  const showConfirmDialog = jest.fn();
  const onActionDone = jest.fn();
  render(
    <ConfirmationDialogContext.Provider value={{ showConfirmDialog, closeConfirmDialog: jest.fn() }}>
      <WfoBulkProcessActionButton action={action} selectedProcesses={selectedProcesses} onActionDone={onActionDone} />
    </ConfirmationDialogContext.Provider>,
  );
  return { showConfirmDialog, onActionDone };
};

// The name of a button with an svg icon starts with the title of the icon
const getButton = (action: WfoConfirmedBulkProcessAction) =>
  screen.queryByRole('button', { name: new RegExp(`tasks\\.bulkActions\\.${action}\\.button$`) });

const clickAndConfirm = async (action: WfoConfirmedBulkProcessAction, showConfirmDialog: jest.Mock) => {
  fireEvent.click(getButton(action)!);
  await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
  await showConfirmDialog.mock.calls[0][0].onConfirm();
};

describe('WfoBulkProcessActionButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAllowed.mockReturnValue(true);
    mockIsEngineRunningNow.mockResolvedValue(true);
    mockBulkProcessAction.mockImplementation(({ action, processIds }: { action: string; processIds: string[] }) => ({
      unwrap: () =>
        Promise.resolve({
          action,
          count: processIds.length,
          results: processIds.map((process_id) => ({ process_id, success: true, error: null })),
        }),
    }));
  });

  describe.each(actionCases)('$action', ({ action, policyResource, needsRunningEngine, applicableTaskIds }) => {
    it('is not shown without its policy', () => {
      mockIsAllowed.mockImplementation((resource: PolicyResource) => resource !== policyResource);
      renderButton(action, allTasks);

      expect(getButton(action)).not.toBeInTheDocument();
    });

    it('is disabled when the action can be applied to none of the selected tasks', () => {
      renderButton(
        action,
        allTasks.filter(({ processId }) => !applicableTaskIds.includes(processId)),
      );

      expect(getButton(action)).toBeDisabled();
    });

    it('applies the action to the tasks it can be applied to in one request after confirmation', async () => {
      const { showConfirmDialog, onActionDone } = renderButton(action, allTasks);

      await clickAndConfirm(action, showConfirmDialog);

      expect(showConfirmDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          question: `tasks.bulkActions.${action}.question: ${applicableTaskIds.length}`,
          subQuestion: `tasks.bulkActions.${action}.skipped: ${allTasks.length - applicableTaskIds.length}`,
          confirmButtonText: `tasks.bulkActions.${action}.button`,
        }),
      );
      expect(mockBulkProcessAction.mock.calls).toEqual([[{ action, processIds: applicableTaskIds, note: undefined }]]);
      expect(mockShowToastMessage).toHaveBeenCalledTimes(1);
      expect(mockShowToastMessage).toHaveBeenCalledWith(
        ToastTypes.SUCCESS,
        `tasks.bulkActions.${action}.successText: ${applicableTaskIds.length}`,
        `tasks.bulkActions.${action}.successTitle`,
      );
      expect(onActionDone).toHaveBeenCalled();
    });

    it('reports the error detail of the backend and keeps the selection when the request is rejected', async () => {
      mockBulkProcessAction.mockImplementation(() => ({
        unwrap: () => Promise.reject({ status: 409, data: { detail: 'failed-task: not possible' } }),
      }));
      const { showConfirmDialog, onActionDone } = renderButton(action, [failedTask]);

      await clickAndConfirm(action, showConfirmDialog);

      expect(mockShowToastMessage).toHaveBeenCalledTimes(1);
      expect(mockShowToastMessage).toHaveBeenCalledWith(
        ToastTypes.ERROR,
        'failed-task: not possible',
        `tasks.bulkActions.${action}.failedTitle`,
      );
      expect(onActionDone).not.toHaveBeenCalled();
    });

    it(`${needsRunningEngine ? 'needs' : 'does not need'} a running engine`, async () => {
      mockIsEngineRunningNow.mockResolvedValue(false);
      const { showConfirmDialog } = renderButton(action, [failedTask]);

      fireEvent.click(getButton(action)!);

      if (needsRunningEngine) {
        await waitFor(() => expect(mockIsEngineRunningNow).toHaveBeenCalled());
        expect(showConfirmDialog).not.toHaveBeenCalled();
      } else {
        await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
        expect(mockIsEngineRunningNow).not.toHaveBeenCalled();
      }
    });
  });

  it('reports a fallback when the rejected request has no error detail', async () => {
    mockBulkProcessAction.mockImplementation(() => ({ unwrap: () => Promise.reject({ status: 500, data: {} }) }));
    const { showConfirmDialog } = renderButton('resume', [failedTask, waitingTask]);

    await clickAndConfirm('resume', showConfirmDialog);

    expect(mockShowToastMessage).toHaveBeenCalledWith(
      ToastTypes.ERROR,
      'tasks.bulkActions.resume.failedText: 2',
      'tasks.bulkActions.resume.failedTitle',
    );
  });

  it('reports the tasks that could not be aborted next to the aborted ones', async () => {
    mockBulkProcessAction.mockImplementation(() => ({
      unwrap: () =>
        Promise.resolve({
          action: 'abort',
          count: 1,
          results: [
            { process_id: 'failed-task', success: true, error: null },
            { process_id: 'running-task', success: false, error: 'Engine error' },
          ],
        }),
    }));
    const { showConfirmDialog, onActionDone } = renderButton('abort', [failedTask, runningTask]);

    await clickAndConfirm('abort', showConfirmDialog);

    expect(mockShowToastMessage).toHaveBeenCalledWith(
      ToastTypes.SUCCESS,
      'tasks.bulkActions.abort.successText: 1',
      'tasks.bulkActions.abort.successTitle',
    );
    expect(mockShowToastMessage).toHaveBeenCalledWith(
      ToastTypes.ERROR,
      'tasks.bulkActions.abort.failedText: 1',
      'tasks.bulkActions.abort.failedTitle',
    );
    expect(onActionDone).toHaveBeenCalled();
  });
});
