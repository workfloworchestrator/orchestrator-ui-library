import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoSkeleton } from './WfoSkeleton';

const meta: Meta<typeof WfoSkeleton> = {
  title: 'Design system/Skeleton',
  component: WfoSkeleton,
  args: { isLoading: true, lines: 3, children: 'The loaded content.' },
};
export default meta;

/** While loading: grey lines in place of the content. */
export const Loading: StoryObj<typeof WfoSkeleton> = {};
/** After loading: the content. */
export const Loaded: StoryObj<typeof WfoSkeleton> = { args: { isLoading: false } };
