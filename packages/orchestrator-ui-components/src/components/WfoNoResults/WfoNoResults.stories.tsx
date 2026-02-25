import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoSearchStrikethrough } from './../../icons';
import { WfoNoResults } from './WfoNoResults';

const Story: Meta<typeof WfoNoResults> = {
  component: WfoNoResults,
  title: 'WfoNoResult',
};
export default Story;

export const Default = {
  args: {
    icon: <WfoSearchStrikethrough />,
    text: 'No results text',
  },
};
