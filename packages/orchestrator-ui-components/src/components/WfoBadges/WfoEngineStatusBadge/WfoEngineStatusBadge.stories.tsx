import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoEngineStatusBadge } from './WfoEngineStatusBadge';

const Story: Meta<typeof WfoEngineStatusBadge> = {
  component: (args) => (
    <div style={{ display: 'flex' }}>
      <WfoEngineStatusBadge {...args} />
    </div>
  ),
  title: 'Badges/WfoEngineStatusBadge',
  parameters: {
    mockData: [
      {
        url: 'https://testing.test/settings/status',
        method: 'GET',
        status: 200,
        response: { global_status: 'RUNNING' },
      },
    ],
  },
};
export default Story;

export const Primary = {
  args: {},
};
