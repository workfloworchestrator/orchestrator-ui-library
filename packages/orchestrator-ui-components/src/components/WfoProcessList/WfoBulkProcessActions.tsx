import React from 'react';

import { ProcessBulkAction } from '@/types';

import { WfoBulkProcessActionButton } from './WfoBulkProcessActionButton';
import { WfoBulkProcessNoteButton } from './WfoBulkProcessNoteButton';
import type { ProcessListItem } from './WfoProcessesList';

export type WfoBulkProcessActionsProps = {
  actions: ProcessBulkAction[];
  selectedProcesses: ProcessListItem[];
  onActionDone: () => void;
};

export const WfoBulkProcessActions = ({ actions, selectedProcesses, onActionDone }: WfoBulkProcessActionsProps) => (
  <>
    {actions.map((action) =>
      action === 'note' ?
        <WfoBulkProcessNoteButton key={action} selectedProcesses={selectedProcesses} onActionDone={onActionDone} />
      : <WfoBulkProcessActionButton
          key={action}
          action={action}
          selectedProcesses={selectedProcesses}
          onActionDone={onActionDone}
        />,
    )}
  </>
);
