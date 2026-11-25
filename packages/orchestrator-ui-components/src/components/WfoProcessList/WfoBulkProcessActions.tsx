import React from 'react';

import { WfoBulkProcessActionButton } from './WfoBulkProcessActionButton';
import { WfoBulkProcessNoteButton } from './WfoBulkProcessNoteButton';
import type { ProcessListItem } from './WfoProcessesList';
import type { WfoBulkProcessAction } from './useBulkProcessAction';

export type { WfoBulkProcessAction } from './useBulkProcessAction';

export type WfoBulkProcessActionsProps = {
  actions: WfoBulkProcessAction[];
  translationNamespace: string;
  selectedProcesses: ProcessListItem[];
  onActionDone: () => void;
};

export const WfoBulkProcessActions = ({
  actions,
  translationNamespace,
  selectedProcesses,
  onActionDone,
}: WfoBulkProcessActionsProps) => (
  <>
    {actions.map((action) =>
      action === 'note' ?
        <WfoBulkProcessNoteButton
          key={action}
          translationNamespace={translationNamespace}
          selectedProcesses={selectedProcesses}
          onActionDone={onActionDone}
        />
      : <WfoBulkProcessActionButton
          key={action}
          action={action}
          translationNamespace={translationNamespace}
          selectedProcesses={selectedProcesses}
          onActionDone={onActionDone}
        />,
    )}
  </>
);
