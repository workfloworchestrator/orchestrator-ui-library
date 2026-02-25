import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoSidebar } from './WfoSidebar';

const Story: Meta<typeof WfoSidebar> = {
  component: (args) => (
    <div style={{ width: '250px', backgroundColor: '#F1F5F9' }}>
      <WfoSidebar {...args} />
    </div>
  ),
  title: 'PageTemplate/WfoSidebar',
};
export default Story;

export const Default = {
  args: {},
};
