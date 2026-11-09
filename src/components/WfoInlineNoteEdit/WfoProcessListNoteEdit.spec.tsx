/**
 * Regression tests for the note column going stale while paginating: the table reuses row
 * components across pages, and EuiInlineEditText only follows its value prop while the value
 * is truthy. A row whose note is empty must therefore still pass a truthy value (the
 * invisible character), otherwise the cell keeps showing the previous page's note.
 */
import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { WfoProcessListNoteEdit } from './WfoProcessListNoteEdit';

jest.mock('@/rtk', () => ({
  ...jest.requireActual('@/rtk'),
  usePatchProcessMutation: () => [jest.fn()],
}));

describe('WfoProcessListNoteEdit', () => {
  it('stops showing the previous note when the reused row has no note', () => {
    const { rerender } = render(<WfoProcessListNoteEdit processId="process-1" note="Note from page one" />);
    expect(screen.getByText('Note from page one')).toBeInTheDocument();

    rerender(<WfoProcessListNoteEdit processId="process-2" note={null} />);
    expect(screen.queryByText('Note from page one')).not.toBeInTheDocument();
  });

  it('shows the new note when the reused row has a different note', () => {
    const { rerender } = render(<WfoProcessListNoteEdit processId="process-1" note="Note from page one" />);

    rerender(<WfoProcessListNoteEdit processId="process-2" note="Note from page two" />);
    expect(screen.getByText('Note from page two')).toBeInTheDocument();
    expect(screen.queryByText('Note from page one')).not.toBeInTheDocument();
  });
});
