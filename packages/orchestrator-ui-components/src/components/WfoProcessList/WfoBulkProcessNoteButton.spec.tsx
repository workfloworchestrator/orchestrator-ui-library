import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ProcessStatus, ToastTypes } from '@/types';

import { WfoBulkProcessNoteButton } from './WfoBulkProcessNoteButton';
import type { ProcessListItem } from './WfoProcessesList';

const mockShowToastMessage = jest.fn();
const mockBulkProcessAction = jest.fn();

jest.mock('@/hooks', () => ({
  useShowToastMessage: () => ({ showToastMessage: mockShowToastMessage }),
}));

jest.mock('@/rtk/endpoints/processDetail', () => ({
  useBulkProcessActionMutation: () => [mockBulkProcessAction, { isLoading: false }],
}));

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string, values?: { count: number }) =>
    `${namespace}.${key}${values ? `: ${values.count}` : ''}`,
}));

const getTask = (processId: string, lastStatus: ProcessStatus) =>
  ({ processId, lastStatus, isTask: true }) as ProcessListItem;

const selectedTasks = [
  getTask('running-task', ProcessStatus.RUNNING),
  getTask('completed-task', ProcessStatus.COMPLETED),
];

const renderButton = (selectedProcesses: ProcessListItem[]) => {
  const onActionDone = jest.fn();
  render(
    <WfoBulkProcessNoteButton
      translationNamespace="tasks.bulkActions"
      selectedProcesses={selectedProcesses}
      onActionDone={onActionDone}
    />,
  );
  return { onActionDone };
};

// The name of a button with an svg icon starts with the title of the icon
const getNoteButton = () => screen.getByRole('button', { name: /tasks\.bulkActions\.note\.button$/ });

const openModal = () => fireEvent.click(getNoteButton());

const getNoteInput = () => screen.getByRole('textbox', { name: 'tasks.bulkActions.note.label' });

const saveNote = () => fireEvent.click(screen.getByRole('button', { name: 'tasks.bulkActions.note.save' }));

describe('WfoBulkProcessNoteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBulkProcessAction.mockImplementation(({ processIds }: { processIds: string[] }) => ({
      unwrap: () =>
        Promise.resolve({
          action: 'note',
          count: processIds.length,
          results: processIds.map((process_id) => ({ process_id, success: true, error: null })),
        }),
    }));
  });

  it('is disabled when no tasks are selected', () => {
    renderButton([]);

    expect(getNoteButton()).toBeDisabled();
  });

  it('sets the note on all selected tasks and closes the modal', async () => {
    const { onActionDone } = renderButton(selectedTasks);

    openModal();
    expect(screen.getByText('tasks.bulkActions.note.title: 2')).toBeInTheDocument();
    fireEvent.change(getNoteInput(), { target: { value: 'Checked by the NOC' } });
    saveNote();

    await waitFor(() => expect(onActionDone).toHaveBeenCalled());
    expect(mockBulkProcessAction).toHaveBeenCalledWith({
      action: 'note',
      processIds: ['running-task', 'completed-task'],
      note: 'Checked by the NOC',
    });
    expect(mockShowToastMessage).toHaveBeenCalledWith(
      ToastTypes.SUCCESS,
      'tasks.bulkActions.note.successText: 2',
      'tasks.bulkActions.note.successTitle',
    );
    expect(screen.queryByText('tasks.bulkActions.note.title: 2')).not.toBeInTheDocument();
  });

  it('clears the notes when the note is left empty', async () => {
    renderButton(selectedTasks);

    openModal();
    fireEvent.change(getNoteInput(), { target: { value: '   ' } });
    saveNote();

    await waitFor(() => expect(mockBulkProcessAction).toHaveBeenCalled());
    expect(mockBulkProcessAction).toHaveBeenCalledWith(expect.objectContaining({ note: null }));
  });

  it('keeps the modal and the note open when saving fails', async () => {
    mockBulkProcessAction.mockImplementation(() => ({
      unwrap: () =>
        Promise.reject({ status: 422, data: { detail: [{ msg: 'String should have at most 5000 characters' }] } }),
    }));
    const { onActionDone } = renderButton(selectedTasks);

    openModal();
    fireEvent.change(getNoteInput(), { target: { value: 'Too long' } });
    saveNote();

    await waitFor(() =>
      expect(mockShowToastMessage).toHaveBeenCalledWith(
        ToastTypes.ERROR,
        'String should have at most 5000 characters',
        'tasks.bulkActions.note.failedTitle',
      ),
    );
    expect(onActionDone).not.toHaveBeenCalled();
    expect(getNoteInput()).toHaveValue('Too long');
  });
});
