import type { FC } from 'react';
import React from 'react';

import { useGetProcessDetailQuery, usePatchProcessMutation } from '@/rtk';
import { ProcessDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';
import { getStyles } from './styles';

interface WfoProcessDetailNoteEditProps {
  processId?: ProcessDetail['processId'];
  onlyShowOnHover?: boolean;
  applyCustomStyle?: boolean;
}

export const WfoProcessDetailNoteEdit: FC<WfoProcessDetailNoteEditProps> = ({
  processId,
  onlyShowOnHover = false,
  applyCustomStyle = false,
}) => {
  const { data } = useGetProcessDetailQuery(
    {
      processId: processId!,
    },
    { skip: !processId },
  );
  const { getProcessDetailPageNoteStyle } = getStyles();
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
    <div css={applyCustomStyle ? getProcessDetailPageNoteStyle : null}>
      <WfoInlineEdit
        value={selectedItem?.note?.trim() ? selectedItem.note : INVISIBLE_CHARACTER}
        onlyShowOnHover={onlyShowOnHover}
        onSave={postProcessNoteChange}
      />
    </div>
  );
};
