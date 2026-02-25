import type { Meta } from '@storybook/react';

import { WfoStepStatusIcon } from './WfoStepStatusIcon';

const Story: Meta<typeof WfoStepStatusIcon> = {
  component: WfoStepStatusIcon,
  title: 'Steps/WfoStepStatusIcon',
};
export default Story;

export const Default = {
  args: {
    steps: 1,
    status: 2,
  },
};
