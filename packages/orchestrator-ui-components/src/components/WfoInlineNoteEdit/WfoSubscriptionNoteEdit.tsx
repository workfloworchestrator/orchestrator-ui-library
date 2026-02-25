import type { FC } from 'react';
import React from 'react';

import { WfoInlineEdit } from '@/components';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useUpdateSubscriptionNoteOptimisticMutation } from '@/rtk/endpoints/subscriptionListMutation';
import { INVISIBLE_CHARACTER } from '@/utils';

interface WfoSubscriptionNoteEditProps {
  onlyShowOnHover?: boolean;
  queryVariables: Record<string, unknown>;
  endpointName: string | undefined;
  subscriptionId: string;
  note: string | null;
}

export const WfoSubscriptionNoteEdit: FC<WfoSubscriptionNoteEditProps> = ({
  onlyShowOnHover = false,
  queryVariables,
  endpointName,
  subscriptionId,
  note,
}) => {
  const [startProcess] = useStartProcessMutation();
  const [updateSub] = useUpdateSubscriptionNoteOptimisticMutation();

  const triggerNoteModifyWorkflow = (note: string) => {
    const noteModifyPayload = [{ subscription_id: subscriptionId }, { note: note === INVISIBLE_CHARACTER ? '' : note }];
    startProcess({
      workflowName: 'modify_note',
      userInputs: noteModifyPayload,
    });

    updateSub({
      queryName: endpointName ?? '',
      subscriptionId: subscriptionId,
      graphQlQueryVariables: queryVariables,
      note: note,
    });
  };

  return (
    <WfoInlineEdit
      value={note?.trim() ? note : INVISIBLE_CHARACTER}
      onlyShowOnHover={onlyShowOnHover}
      onSave={triggerNoteModifyWorkflow}
    />
  );
};
