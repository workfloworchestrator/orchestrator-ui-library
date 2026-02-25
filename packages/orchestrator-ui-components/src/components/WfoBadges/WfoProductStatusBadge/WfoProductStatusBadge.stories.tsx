import type { Meta } from '@storybook/react';

import { ProductLifecycleStatus } from '../../../types';
import { WfoProductStatusBadge } from './WfoProductStatusBadge';

const Story: Meta<typeof WfoProductStatusBadge> = {
  component: WfoProductStatusBadge,
  title: 'Badges/WfoProductStatusBadge',
};
export default Story;

export const Default = {
  args: {
    status: ProductLifecycleStatus.ACTIVE,
  },
};

export const Terminated = {
  args: {
    status: ProductLifecycleStatus.END_OF_LIFE,
  },
};
