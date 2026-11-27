import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { withMaxWidth } from '@/storybook/decorators';

import { WfoLink } from '../../navigation/WfoLink';
import { WfoList, WfoListItem } from './WfoList';

const meta: Meta<typeof WfoList> = {
  title: 'Design system/List',
  component: WfoList,
  subcomponents: { WfoListItem },
  args: { title: 'Most recent workflows', emptyText: 'No items', isLoading: false },
  decorators: [withMaxWidth(360)],
};
export default meta;

type Story = StoryObj<typeof WfoList>;

/** Switch isLoading in the controls. */
export const Default: Story = {
  render: (args) => (
    <WfoList {...args}>
      <WfoListItem description="20/11/2026, 11:00:00">
        <WfoLink href="#1">Modify L2VPN</WfoLink>
      </WfoListItem>
      <WfoListItem description="19/11/2026, 09:30:00">
        <WfoLink href="#2">Create Node</WfoLink>
      </WfoListItem>
      <WfoListItem>Terminate IP Prefix</WfoListItem>
    </WfoList>
  ),
};

/** Without items, the list shows `emptyText`. */
export const Empty: Story = {};
