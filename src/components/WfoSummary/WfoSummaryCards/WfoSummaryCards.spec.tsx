import React from 'react';

import { NextIntlClientProvider } from 'next-intl';

import { fireEvent, render, screen } from '@testing-library/react';

import messages from '../../../messages/en-GB.json';
import { WfoSummaryCard } from '../WfoSummaryCard';
import { WfoSummaryCards } from './WfoSummaryCards';

const STORAGE_KEY = 'wfo.summaryCards.v1';

const renderWithMessages = (children: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="en-GB" messages={messages}>
      {children}
    </NextIntlClientProvider>,
  );

const renderCards = () =>
  render(
    <NextIntlClientProvider locale="en-GB" messages={messages}>
      <WfoSummaryCards>
        {['alpha', 'beta', 'gamma'].map((cardId) => (
          <WfoSummaryCard key={cardId} headerTitle={`Card ${cardId}`} headerValue={1} listTitle="List" listItems={[]} />
        ))}
      </WfoSummaryCards>
    </NextIntlClientProvider>,
  );

const getCardIdsInPageOrder = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-sortable-id]')].map((item) => item.getAttribute('data-sortable-id'));

describe('WfoSummaryCards', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows every card, collapsed, in the order of the children', () => {
    const { container } = renderCards();

    expect(getCardIdsInPageOrder(container)).toEqual(['alpha', 'beta', 'gamma']);
    screen.getAllByRole('button', { name: /^Details of Card/ }).forEach((chevron) => {
      expect(chevron).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('gives every card a drag handle', () => {
    renderCards();

    expect(screen.getAllByRole('button', { name: /^Reorder Card/ })).toHaveLength(3);
  });

  it('expands and collapses all cards and remembers it', () => {
    renderCards();

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    screen.getAllByRole('button', { name: /^Details of Card/ }).forEach((chevron) => {
      expect(chevron).toHaveAttribute('aria-expanded', 'true');
    });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}').expanded).toEqual(['alpha', 'beta', 'gamma']);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}').expanded).toEqual([]);
  });

  it('opens one card on its own and saves it', () => {
    renderCards();

    fireEvent.click(screen.getByRole('button', { name: 'Details of Card beta' }));

    expect(screen.getByRole('button', { name: 'Details of Card beta' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Details of Card alpha' })).toHaveAttribute('aria-expanded', 'false');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}').expanded).toEqual(['beta']);
  });

  it('restores the saved order and expanded cards', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ order: ['gamma', 'beta', 'alpha'], expanded: ['gamma'] }),
    );
    const { container } = renderCards();

    expect(getCardIdsInPageOrder(container)).toEqual(['gamma', 'beta', 'alpha']);
    expect(screen.getByRole('button', { name: 'Details of Card gamma' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('resets the order but keeps the expanded cards', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ order: ['gamma', 'beta', 'alpha'], expanded: ['gamma'] }),
    );
    const { container } = renderCards();

    fireEvent.click(screen.getByRole('button', { name: 'Reset layout' }));

    expect(getCardIdsInPageOrder(container)).toEqual(['alpha', 'beta', 'gamma']);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({ order: [], expanded: ['gamma'] });
  });

  it('shows an error when cards have no unique key', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <NextIntlClientProvider locale="en-GB" messages={messages}>
        <WfoSummaryCards>
          {[
            <WfoSummaryCard key="same" headerTitle="One" headerValue={1} listTitle="List" listItems={[]} />,
            <WfoSummaryCard key="same" headerTitle="Two" headerValue={2} listTitle="List" listItems={[]} />,
          ]}
        </WfoSummaryCards>
      </NextIntlClientProvider>,
    );

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('give every card a unique `key`'));
    consoleError.mockRestore();
  });

  it('names each drag handle after its card, also when the card is a wrapper', () => {
    const PlannedWorksCard = () => (
      <WfoSummaryCard headerTitle="Planned works" headerValue={1} listTitle="List" listItems={[]} />
    );
    renderWithMessages(<WfoSummaryCards>{[<PlannedWorksCard key="plannedWorks" />]}</WfoSummaryCards>);

    expect(screen.getByRole('button', { name: 'Reorder Planned works' })).toBeInTheDocument();
  });

  it('accepts a single card and skips empty entries', () => {
    const isShown = false;
    const { container } = renderWithMessages(
      <WfoSummaryCards>
        {[
          <WfoSummaryCard key="alpha" headerTitle="Card alpha" headerValue={1} listTitle="List" listItems={[]} />,
          isShown && (
            <WfoSummaryCard key="beta" headerTitle="Card beta" headerValue={1} listTitle="List" listItems={[]} />
          ),
        ]}
      </WfoSummaryCards>,
    );

    expect(getCardIdsInPageOrder(container)).toEqual(['alpha']);
  });

  it('saves under its own storage key', () => {
    renderWithMessages(
      <WfoSummaryCards storageKey="customCards">
        <WfoSummaryCard key="alpha" headerTitle="Card alpha" headerValue={1} listTitle="List" listItems={[]} />
      </WfoSummaryCards>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));

    expect(JSON.parse(window.localStorage.getItem('customCards') ?? '{}').expanded).toEqual(['alpha']);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('shows an error when a card has no key', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    renderWithMessages(
      <WfoSummaryCards>
        {[
          React.createElement(WfoSummaryCard, {
            headerTitle: 'No key',
            headerValue: 1,
            listTitle: 'List',
            listItems: [],
          }),
        ]}
      </WfoSummaryCards>,
    );

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('give every card a unique `key`'));
    consoleError.mockRestore();
  });
});
