import type { Meta } from '@storybook/react';

import { WfoInsyncIcon } from './WfoInsyncIcon';

const Story: Meta<typeof WfoInsyncIcon> = {
  component: WfoInsyncIcon,
  title: 'WfoInsyncIcon',
};
export default Story;

export const Default = {
  args: {
    inSync: true,
  },
};

export const DefaultOutofSync = {
  args: {
    inSync: false,
  },
};
