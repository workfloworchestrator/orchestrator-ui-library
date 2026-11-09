import type { FC } from 'react';
import React from 'react';

import { usePatchProcessMutation } from '@/rtk';
import { ProcessDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoProcessDetailNoteEditProps {
  processId: ProcessDetail['processId'];
  note: ProcessDetail['note'];
}

export const WfoProcessListNoteEdit: FC<WfoProcessDetailNoteEditProps> = ({ processId, note }) => {
  const [patchProcess] = usePatchProcessMutation();

  const onSaveNote = async (note: string) => {
    const noteModifyPayload = { id: processId, note: note };
    patchProcess(noteModifyPayload);
    return note;
  };

  // An empty note must still be passed as a non-empty string (the invisible character):
  // EuiInlineEditText only follows its value prop while the value is truthy, so an empty
  // string would freeze the cell on the note of whichever row rendered here before it,
  // e.g. when the table rows are reused while paginating.
  return <WfoInlineEdit value={note?.trim() ? note : INVISIBLE_CHARACTER} onSave={onSaveNote} />;
};
