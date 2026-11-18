import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { WfoBulkEditToolbar } from './WfoBulkEditToolbar';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: { count: number }) => (values ? `${key}: ${values.count}` : key),
}));

const isFollowedBy = (firstElement: Element, secondElement: Element) =>
  Boolean(firstElement.compareDocumentPosition(secondElement) & Node.DOCUMENT_POSITION_FOLLOWING);

describe('WfoBulkEditToolbar', () => {
  it('shows the actions right of the select all button and the number of selected rows below the buttons', () => {
    render(
      <WfoBulkEditToolbar
        bulkEdit={{
          selectedRows: [{ processId: '1' }, { processId: '2' }],
          isAllSelected: false,
          canSelectAll: true,
          handleToggleSelectAll: jest.fn(),
          handleToggleBulkEditMode: jest.fn(),
        }}
        actions={<button>Retry selected</button>}
      />,
    );

    const selectAllButton = screen.getByRole('button', { name: 'selectAll' });
    const actionButton = screen.getByRole('button', { name: 'Retry selected' });
    const exitButton = screen.getByRole('button', { name: /exitBulkEditMode/ });
    const numberOfSelectedRows = screen.getByText('numberOfSelectedRows: 2');

    expect(isFollowedBy(selectAllButton, actionButton)).toBe(true);
    expect(isFollowedBy(actionButton, exitButton)).toBe(true);
    expect(isFollowedBy(exitButton, numberOfSelectedRows)).toBe(true);
  });
});
