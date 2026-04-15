import type { FC } from 'react';
import React from 'react';

import { useGetProcessDetailQuery, usePatchProcessMutation } from '@/rtk';
import { ProcessDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoProcessDetailNoteEditProps {
  processId?: ProcessDetail['processId'];
  onlyShowOnHover?: boolean;
}

export const WfoProcessTimelineNoteEdit: FC<WfoProcessDetailNoteEditProps> = ({
  processId,
  onlyShowOnHover = false,
}) => {
  const { data } = useGetProcessDetailQuery(
    {
      processId: processId!,
    },
    { skip: !processId }, // Skip this query if processId is undefined (shouldn't happen)
  );
  const [patchProcess] = usePatchProcessMutation();
  if (!processId) {
    return <></>;
  }

  const selectedItem = data?.processes[0] ?? { note: '' };

  const postProcessNoteChange = async (note: string) => {
    const noteModifyPayload = { id: processId, note: note };
    patchProcess(noteModifyPayload);
    return note;
  };

  return (
    <WfoInlineEdit
      value={selectedItem?.note?.trim() ? selectedItem.note : INVISIBLE_CHARACTER}
      onlyShowOnHover={onlyShowOnHover}
      onSave={postProcessNoteChange}
    />
  );
};
