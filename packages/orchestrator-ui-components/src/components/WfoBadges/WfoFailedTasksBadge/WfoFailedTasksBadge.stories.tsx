import type { Meta } from '@storybook/react';

import { WfoFailedTasksBadge } from './WfoFailedTasksBadge';

const Story: Meta<typeof WfoFailedTasksBadge> = {
  component: WfoFailedTasksBadge,
  title: 'Badges/WfoFailedTasksBadge',
};
export default Story;

export const Primary = {
  args: {},
};
