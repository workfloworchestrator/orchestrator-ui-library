import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoCheckmarkCircleFill, WfoCubeFill, WfoExclamationTriangle } from '@/icons';
import { withRow } from '@/storybook/decorators';

import { WfoIconTile } from './WfoIconTile';

const meta: Meta<typeof WfoIconTile> = {
  title: 'Design system/IconTile',
  component: WfoIconTile,
  args: { color: 'info', children: <WfoCubeFill width={32} height={32} color="currentColor" /> },
  argTypes: { color: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] } },
};
export default meta;

type Story = StoryObj<typeof WfoIconTile>;

/** Change the color in the controls. */
export const Default: Story = {};

/** Every color with the icon it gets in a summary card. */
export const AllColors: Story = {
  decorators: [withRow],
  render: () => (
    <>
      <WfoIconTile color="info">
        <WfoCubeFill width={32} height={32} color="currentColor" />
      </WfoIconTile>
      <WfoIconTile color="success">
        <WfoCheckmarkCircleFill width={32} height={32} color="currentColor" />
      </WfoIconTile>
      <WfoIconTile color="warning">
        <WfoExclamationTriangle width={32} height={32} color="currentColor" />
      </WfoIconTile>
      <WfoIconTile color="danger">
        <WfoExclamationTriangle width={32} height={32} color="currentColor" />
      </WfoIconTile>
    </>
  ),
};
