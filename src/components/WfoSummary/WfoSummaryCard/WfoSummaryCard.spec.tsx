import React from 'react';

import { NextIntlClientProvider } from 'next-intl';

import { fireEvent, render, screen } from '@testing-library/react';

import messages from '../../../messages/en-GB.json';
import { WfoSortableListContext } from '../../../ui/dragAndDrop/sortableContext';
import { SummaryCardStatus, WfoSummaryCard, WfoSummaryCardProps } from './WfoSummaryCard';
import { WfoSummaryCardContext } from './WfoSummaryCardContext';

const listItems = [
  { title: 'Modify L2VPN', value: '20/11/2026', url: '/workflows/1' },
  { title: 'No link', value: 'x' },
];

const renderCard = (
  props: Partial<WfoSummaryCardProps> = {},
  contextValue?: React.ContextType<typeof WfoSummaryCardContext>,
) =>
  render(
    <NextIntlClientProvider locale="en-GB" messages={messages}>
      <WfoSummaryCardContext.Provider value={contextValue ?? null}>
        <WfoSummaryCard
          headerTitle="Active workflows"
          headerValue={1234}
          listTitle="Most recent"
          listItems={listItems}
          {...props}
        />
      </WfoSummaryCardContext.Provider>
    </NextIntlClientProvider>,
  );

describe('WfoSummaryCard', () => {
  // The deprecated props warn in the console. warnDeprecated has its own test.
  beforeAll(() => jest.spyOn(console, 'warn').mockImplementation(() => undefined));
  afterAll(() => jest.restoreAllMocks());

  it('shows the title and the formatted amount', () => {
    renderCard();

    expect(screen.getByRole('heading', { level: 2, name: 'Active workflows' })).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('links the title to the details page when a button is given', () => {
    renderCard({ button: { name: 'Show all', url: '/workflows' } });

    expect(screen.getByRole('link', { name: 'Active workflows' })).toHaveAttribute('href', '/workflows');
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)('shows the %s color', (color) => {
    renderCard({ color });

    expect(screen.getByRole('region')).toHaveAttribute('data-summary-card-color', color);
  });

  it('shows your own icon in the tile', () => {
    renderCard({ icon: <svg data-testid="own-icon" /> });

    expect(screen.getByTestId('own-icon')).toBeInTheDocument();
  });

  it('uses a component from the deprecated headerBadge as the icon', () => {
    const BadgeIcon = () => <svg data-testid="badge-icon" />;
    renderCard({ headerBadge: { iconType: BadgeIcon, iconColor: 'red' } });

    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('is collapsed at first and toggles with a click on the card or on the chevron', () => {
    renderCard();
    const chevron = screen.getByRole('button', { name: 'Details of Active workflows' });
    expect(chevron).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('heading', { level: 2 }));
    expect(chevron).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Modify L2VPN')).toBeVisible();

    fireEvent.click(chevron);
    expect(chevron).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not toggle when the title link is clicked', () => {
    renderCard({ button: { name: 'Show all', url: '/workflows' } });

    fireEvent.click(screen.getByRole('link', { name: 'Active workflows' }));

    expect(screen.getByRole('button', { name: 'Details of Active workflows' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('shows a dash instead of the amount while loading', () => {
    renderCard({ isLoading: true });

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('lists the items when open, and a message when there are none', () => {
    renderCard({ listItems: [] });
    fireEvent.click(screen.getByRole('heading', { level: 2 }));

    expect(screen.getByText('Nothing to show')).toBeVisible();
  });

  it('follows the expanded state from WfoSummaryCards', () => {
    const onExpandedChange = jest.fn();
    renderCard({}, { isExpanded: true, onExpandedChange, onTitleChange: jest.fn() });

    expect(screen.getByRole('button', { name: 'Details of Active workflows' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.click(screen.getByRole('heading', { level: 2 }));
    expect(onExpandedChange).toHaveBeenCalledWith(false);
  });

  it('is info by default', () => {
    renderCard();

    expect(screen.getByRole('region')).toHaveAttribute('data-summary-card-color', 'info');
  });

  it.each([
    [SummaryCardStatus.Success, 0, 'success'],
    [SummaryCardStatus.Error, 0, 'danger'],
    [SummaryCardStatus.Error, 3, 'danger'],
    [SummaryCardStatus.Neutral, 3, 'info'],
  ] as const)(
    'keeps the old color for the deprecated %s status (count %s): %s',
    (headerStatus, headerValue, expectedColor) => {
      renderCard({ headerStatus, headerValue });

      expect(screen.getByRole('region')).toHaveAttribute('data-summary-card-color', expectedColor);
    },
  );

  it('uses the default icon when the deprecated headerBadge has an EUI icon name', () => {
    const { container } = renderCard({ headerBadge: { iconType: 'alert', iconColor: 'red' } });

    expect(container.querySelector('[data-color="info"] svg')).toBeInTheDocument();
  });

  it('closes while a card is dragged, also when it is open', () => {
    render(
      <NextIntlClientProvider locale="en-GB" messages={messages}>
        <WfoSortableListContext.Provider value={{ activeId: 'other', isDragActive: true }}>
          <WfoSummaryCardContext.Provider
            value={{ isExpanded: true, onExpandedChange: jest.fn(), onTitleChange: jest.fn() }}
          >
            <WfoSummaryCard headerTitle="Active workflows" headerValue={1} listTitle="List" listItems={listItems} />
          </WfoSummaryCardContext.Provider>
        </WfoSortableListContext.Provider>
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('button', { name: 'Details of Active workflows' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('reports its title to WfoSummaryCards', () => {
    const onTitleChange = jest.fn();
    renderCard({}, { isExpanded: false, onExpandedChange: jest.fn(), onTitleChange });

    expect(onTitleChange).toHaveBeenCalledWith('Active workflows');
  });

  it('prefers color over the deprecated status', () => {
    renderCard({ color: 'info', headerStatus: SummaryCardStatus.Error, headerValue: 3 });

    expect(screen.getByRole('region')).toHaveAttribute('data-summary-card-color', 'info');
  });
});
