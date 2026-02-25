import type { Meta } from '@storybook/react';

import { WfoSubscriptionStatusBadge } from './WfoSubscriptionStatusBadge';

const Story: Meta<typeof WfoSubscriptionStatusBadge> = {
  component: WfoSubscriptionStatusBadge,
  title: 'Badges/WfoSubscriptionStatusBadge',
};
export default Story;

export const Default = {
  args: {
    status: 'default badge',
  },
};

export const Active = {
  args: {
    status: 'active',
  },
};

export const Terminated = {
  args: {
    status: 'terminated',
  },
};
