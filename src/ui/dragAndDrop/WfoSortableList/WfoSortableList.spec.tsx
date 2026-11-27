import React from 'react';

import { render, screen } from '@testing-library/react';

import { WfoSortableItem } from '../WfoSortableItem';
import { useWfoSortableList } from '../sortableContext';
import { WfoSortableList } from './WfoSortableList';

const itemIds = ['first', 'second', 'third'];

const DragState = () => <span>{useWfoSortableList()?.isDragActive ? 'dragging' : 'at rest'}</span>;

const renderList = () =>
  render(
    <WfoSortableList itemIds={itemIds} onReorder={jest.fn()} renderOverlay={(id) => id} instructions="Use space">
      <DragState />
      {itemIds.map((itemId) => (
        <WfoSortableItem key={itemId} id={itemId} handleLabel={`Reorder ${itemId}`}>
          {itemId}
        </WfoSortableItem>
      ))}
    </WfoSortableList>,
  );

describe('WfoSortableList', () => {
  it('renders one sortable item with a drag handle for each id', () => {
    const { container } = renderList();

    expect(
      [...container.querySelectorAll('[data-sortable-id]')].map((sortableItem) =>
        sortableItem.getAttribute('data-sortable-id'),
      ),
    ).toEqual(itemIds);
    expect(screen.getAllByRole('button', { name: /Reorder/ })).toHaveLength(3);
  });

  it('makes the drag handles keyboard sortable and describes them for screen readers', () => {
    renderList();

    const dragHandle = screen.getByRole('button', { name: 'Reorder first' });
    expect(dragHandle).toHaveAttribute('aria-roledescription', 'sortable');
    expect(dragHandle).toHaveAttribute('tabindex', '0');
    expect(document.body).toHaveTextContent('Use space');
  });

  it('shares the drag state with the parts inside', () => {
    renderList();

    expect(screen.getByText('at rest')).toBeInTheDocument();
  });
});
