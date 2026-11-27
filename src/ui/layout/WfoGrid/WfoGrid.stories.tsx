import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoPanel } from '../WfoPanel';
import { WfoGrid } from './WfoGrid';

// Texts of different lengths give tiles of different heights, to show rows against masonry.
const tiles = [
  ['Chassis', 'One line.'],
  [
    'Services',
    'A longer text that takes several lines. It makes this tile taller than the others, so you can see how the layout handles tiles of different heights.',
  ],
  ['Customers', 'Two lines of text in a narrow column.'],
  ['Fibers', 'One line.'],
  ['Ports', 'Two lines of text in a narrow column.'],
  [
    'Links',
    'A longer text that takes several lines. It makes this tile taller than the others, so you can see how the layout handles tiles of different heights.',
  ],
];

const meta: Meta<typeof WfoGrid> = {
  title: 'Design system/Grid',
  component: WfoGrid,
  args: {
    maxColumns: 3,
    gap: 300,
    children: tiles.map(([tileName, tileText]) => (
      <WfoPanel key={tileName}>
        <strong>{tileName}</strong>
        <p>{tileText}</p>
      </WfoPanel>
    )),
  },
  argTypes: { gap: { control: 'inline-radio', options: [0, 50, 100, 150, 200, 300] } },
};
export default meta;

/** Items in the same row get the same height. */
export const Rows: StoryObj<typeof WfoGrid> = {};
/** Each column stacks on its own, so a tall item only pushes down the items below it. */
export const Masonry: StoryObj<typeof WfoGrid> = { args: { layout: 'masonry' } };
