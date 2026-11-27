import React from 'react';

import { NextIntlClientProvider } from 'next-intl';

import { fireEvent, render, screen } from '@testing-library/react';

import type { WfoSortableListProps } from '@/ui';

import messages from '../../../messages/en-GB.json';
import { WfoSummaryCard } from '../WfoSummaryCard';
import { WfoSummaryCards } from './WfoSummaryCards';

// The drag library needs real layout, which jsdom does not have. This stand-in drops "gamma" in front,
// and shows what screen readers would hear.
jest.mock('@/ui', () => {
  const actualUi = jest.requireActual('@/ui');
  return {
    ...actualUi,
    WfoSortableList: ({ itemIds, onReorder, announcements, children }: WfoSortableListProps) => (
      <>
        <button onClick={() => onReorder(['gamma', ...itemIds.filter((itemId) => itemId !== 'gamma')])}>
          Drop gamma first
        </button>
        <output>{announcements?.onDrop('gamma', 'alpha')}</output>
        {children}
      </>
    ),
  };
});

const STORAGE_KEY = 'wfo.summaryCards.v1';

describe('WfoSummaryCards reorder', () => {
  beforeEach(() => window.localStorage.clear());

  it('saves the new order after a drop and keeps the open cards', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ order: [], expanded: ['beta'] }));
    const { container } = render(
      <NextIntlClientProvider locale="en-GB" messages={messages}>
        <WfoSummaryCards>
          {['alpha', 'beta', 'gamma'].map((cardId) => (
            <WfoSummaryCard
              key={cardId}
              headerTitle={`Card ${cardId}`}
              headerValue={1}
              listTitle="List"
              listItems={[]}
            />
          ))}
        </WfoSummaryCards>
      </NextIntlClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Drop gamma first' }));

    const cardIdsInPageOrder = [...container.querySelectorAll('[data-sortable-id]')].map((item) =>
      item.getAttribute('data-sortable-id'),
    );
    expect(cardIdsInPageOrder).toEqual(['gamma', 'alpha', 'beta']);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({
      order: ['gamma', 'alpha', 'beta'],
      expanded: ['beta'],
    });
  });

  it('tells screen readers the card titles, not the ids', () => {
    render(
      <NextIntlClientProvider locale="en-GB" messages={messages}>
        <WfoSummaryCards>
          {['alpha', 'gamma'].map((cardId) => (
            <WfoSummaryCard
              key={cardId}
              headerTitle={`Card ${cardId}`}
              headerValue={1}
              listTitle="List"
              listItems={[]}
            />
          ))}
        </WfoSummaryCards>
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Card gamma dropped at the place of Card alpha.');
  });
});
