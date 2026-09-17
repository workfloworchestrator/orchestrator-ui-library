import type { FC } from 'react';
import React from 'react';

import { useGetSubscriptionDetailQuery } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useUpdateSubscriptionNoteOptimisticMutation } from '@/rtk/endpoints/subscriptionListMutation';
import { SubscriptionDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoSubscriptionDetailNoteEditProps {
  subscriptionId: SubscriptionDetail['subscriptionId'];
  onlyShowOnHover?: boolean;
}

export const WfoSubscriptionDetailNoteEdit: FC<WfoSubscriptionDetailNoteEditProps> = ({
  subscriptionId,
  onlyShowOnHover = false,
}) => {
  const { data } = useGetSubscriptionDetailQuery({
    subscriptionId,
  });

  const selectedItem = data?.subscription ?? { note: '' };
  const [startProcess] = useStartProcessMutation();
  const [updateSubscriptionNoteOptimistic] = useUpdateSubscriptionNoteOptimisticMutation();

  const triggerNoteModifyWorkflow = (note: string) => {
    const noteModifyPayload = [{ subscription_id: subscriptionId }, { note: note }];
    startProcess({
      workflowName: 'modify_note',
      userInputs: noteModifyPayload,
    });

    updateSubscriptionNoteOptimistic({ subscriptionId, note });
  };

  return (
    <WfoInlineEdit
      value={selectedItem?.note?.trim() ? selectedItem.note : INVISIBLE_CHARACTER}
      onlyShowOnHover={onlyShowOnHover}
      onSave={triggerNoteModifyWorkflow}
    />
  );
};
