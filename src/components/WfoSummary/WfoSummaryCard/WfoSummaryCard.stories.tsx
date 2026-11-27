import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { withMaxWidth } from '@/storybook/decorators';

import { WfoSummaryCards } from '../WfoSummaryCards';
import { WfoSummaryCard } from './WfoSummaryCard';

const listItems = [
  { title: 'Modify L2VPN', value: '20/11/2026, 11:00:00', url: '/workflows/1' },
  { title: 'Create Node', value: '19/11/2026, 09:30:00', url: '/workflows/2' },
  { title: 'Terminate IP Prefix', value: '18/11/2026, 16:45:00', url: '/workflows/3' },
];

const meta: Meta<typeof WfoSummaryCard> = {
  title: 'Orchestrator/SummaryCard',
  component: WfoSummaryCard,
  args: {
    headerTitle: 'Active workflows',
    headerValue: 12,
    listTitle: 'Most recent active workflows',
    listItems,
    button: { name: 'Show all', url: '/workflows' },
  },
};
export default meta;

type Story = StoryObj<typeof WfoSummaryCard>;

const withCardWidth = [withMaxWidth(420)];

/** `color="info"`, the default: blue. */
export const Info: Story = { args: { color: 'info' }, decorators: withCardWidth };
/** `color="success"`: green, nothing to do. */
export const Success: Story = {
  args: { color: 'success', headerTitle: 'Failed tasks', headerValue: 0, listItems: [] },
  decorators: withCardWidth,
};
/** `color="warning"`: orange, keep an eye on it. */
export const Warning: Story = {
  args: { color: 'warning', headerTitle: 'Subscriptions close to their limit', headerValue: 3 },
  decorators: withCardWidth,
};
/** `color="danger"`: red, something needs attention. */
export const Danger: Story = {
  args: { color: 'danger', headerTitle: 'Failed tasks', headerValue: 9 },
  decorators: withCardWidth,
};
/** First load: '-' and grey lines. The spinner shows a reload. */
export const Loading: Story = { args: { isLoading: true, isFetching: true }, decorators: withCardWidth };
/** A long title stops after 2 lines with '…'. */
export const LongTitle: Story = {
  args: { headerTitle: 'Total active out-of-sync subscriptions that need attention from the network team' },
  decorators: withCardWidth,
};

const startPageCards = [
  ['plannedWorks', 'Planned works & incidents', 9, true],
  ['coreLinks', 'Core links in maintenance', 1, true],
  ['myWorkflows', 'My completed workflows', 121, false],
  ['activeWorkflows', 'Active workflows', 2, false],
  ['failedTasks', 'Failed tasks', 0, true],
  ['outOfSync', 'Out-of-sync subscriptions', 2, true],
  ['activeSubscriptions', 'Active subscriptions', 112, false],
  ['products', 'Products', 63, false],
] as const;

/** The cards as on the start page, in `WfoSummaryCards`: sortable, with expand all and reset layout. */
export const Cards: Story = {
  render: () => (
    <WfoSummaryCards>
      {startPageCards.map(([cardId, cardTitle, cardCount, isMoreWorse]) => (
        <WfoSummaryCard
          key={cardId}
          headerTitle={cardTitle}
          headerValue={cardCount}
          color={
            isMoreWorse ?
              cardCount > 0 ?
                'danger'
              : 'success'
            : 'info'
          }
          listTitle={`Most recent: ${cardTitle}`}
          listItems={listItems}
        />
      ))}
    </WfoSummaryCards>
  ),
};
