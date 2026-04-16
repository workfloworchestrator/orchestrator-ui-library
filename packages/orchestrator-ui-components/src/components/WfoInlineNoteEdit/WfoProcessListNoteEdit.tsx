import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { usePatchProcessMutation } from '@/rtk';
import { ProcessDetail } from '@/types';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoProcessDetailNoteEditProps {
  processId: ProcessDetail['processId'];
  note: ProcessDetail['note'];
}

export const WfoProcessListNoteEdit: FC<WfoProcessDetailNoteEditProps> = ({ processId, note }) => {
  const [patchProcess] = usePatchProcessMutation();
  const [noteValue, setNoteValue] = useState(note);

  useEffect(() => {
    if (note !== noteValue) {
      setNoteValue(note);
    }
  }, [note]);

  const postProcessNoteChange = async (note: string) => {
    const noteModifyPayload = { id: processId, note: note };
    patchProcess(noteModifyPayload);
    return note;
  };

  return <WfoInlineEdit value={noteValue?.trim() || ''} onSave={postProcessNoteChange} />;
};
