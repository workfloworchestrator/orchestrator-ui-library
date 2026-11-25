import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ProcessStatus } from '@/types';

import type { WfoBulkProcessActionButtonProps } from './WfoBulkProcessActionButton';
import { WfoBulkProcessActions } from './WfoBulkProcessActions';
import type { ProcessListItem } from './WfoProcessesList';

jest.mock('./WfoBulkProcessActionButton', () => ({
  WfoBulkProcessActionButton: ({ translationNamespace, action }: WfoBulkProcessActionButtonProps) => (
    <button>{`${translationNamespace}.${action}`}</button>
  ),
}));

jest.mock('./WfoBulkProcessNoteButton', () => ({
  WfoBulkProcessNoteButton: ({ translationNamespace }: { translationNamespace: string }) => (
    <button>{`${translationNamespace}.note`}</button>
  ),
}));

const failedWorkflow = { processId: 'failed-workflow', lastStatus: ProcessStatus.FAILED } as ProcessListItem;

describe('WfoBulkProcessActions', () => {
  it('renders the buttons of the actions in their order with the translation namespace', () => {
    render(
      <WfoBulkProcessActions
        actions={['retry', 'abort', 'note']}
        translationNamespace="workflows.bulkActions"
        selectedProcesses={[failedWorkflow]}
        onActionDone={jest.fn()}
      />,
    );

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'workflows.bulkActions.retry',
      'workflows.bulkActions.abort',
      'workflows.bulkActions.note',
    ]);
  });
});
