import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoEnvironmentBadge } from './WfoEnvironmentBadge';

const Story: Meta<typeof WfoEnvironmentBadge> = {
  component: (args) => (
    <div style={{ display: 'flex' }}>
      <WfoEnvironmentBadge {...args} />
    </div>
  ),
  title: 'Badges/WfoEnvironmentBadge',
};
export default Story;

export const Primary = {
  args: {},
};
