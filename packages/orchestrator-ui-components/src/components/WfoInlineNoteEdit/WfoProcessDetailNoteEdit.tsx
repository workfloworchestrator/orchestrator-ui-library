import type { FC } from 'react';
import React from 'react';

import { useGetProcessDetailQuery } from '@/rtk';
import { ProcessDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoProcessDetailNoteEditProps {
  processId: ProcessDetail['processId'];
  onlyShowOnHover?: boolean;
}

export const WfoProcessDetailNoteEdit: FC<WfoProcessDetailNoteEditProps> = ({ processId, onlyShowOnHover = false }) => {
  // const { data, endpointName } = useGetProcessDetailQuery({
  const { data } = useGetProcessDetailQuery({
    processId,
  });

  const selectedItem = data?.processes[0] ?? { note: '' };

  const triggerNoteModifyWorkflow = (note: string) => {
    // const noteModifyPayload = [{ process_id: processId }, { note: note }];
    return note;
  };

  return (
    <WfoInlineEdit
      value={selectedItem?.note?.trim() ? selectedItem.note : INVISIBLE_CHARACTER}
      onlyShowOnHover={onlyShowOnHover}
      onSave={triggerNoteModifyWorkflow}
    />
  );
};
