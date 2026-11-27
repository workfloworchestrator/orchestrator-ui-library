import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoSpinner } from './WfoSpinner';

const meta: Meta<typeof WfoSpinner> = {
  title: 'Design system/Spinner',
  component: WfoSpinner,
  args: { label: 'Loading' },
};
export default meta;

/** The spinner takes the size of the text around it. */
export const Default: StoryObj<typeof WfoSpinner> = {};
