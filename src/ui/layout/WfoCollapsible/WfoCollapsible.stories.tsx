import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoPanel } from '../WfoPanel';
import { WfoCollapsiblePanel, WfoCollapsibleRoot, WfoCollapsibleTrigger } from './WfoCollapsible';

const meta: Meta<typeof WfoCollapsibleRoot> = {
  title: 'Design system/Collapsible',
  component: WfoCollapsibleRoot,
  subcomponents: { WfoCollapsibleTrigger, WfoCollapsiblePanel },
  parameters: {
    docs: {
      description: {
        component:
          'Shows and hides a part of the content. Root holds the state (`open`, `onOpenChange`), Trigger is the chevron button, Panel is the part that opens. Built on Base UI Collapsible.',
      },
    },
  },
};
export default meta;

/** Click the chevron to open and close the panel. */
export const Default: StoryObj = {
  render: () => (
    <WfoPanel>
      <WfoCollapsibleRoot>
        <WfoCollapsibleTrigger label="Show details" />
        <WfoCollapsiblePanel>The details, shown when open.</WfoCollapsiblePanel>
      </WfoCollapsibleRoot>
    </WfoPanel>
  ),
};
