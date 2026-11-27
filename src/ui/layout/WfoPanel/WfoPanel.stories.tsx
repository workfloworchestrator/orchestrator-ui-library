import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoPanel } from './WfoPanel';

const meta: Meta<typeof WfoPanel> = {
  title: 'Design system/Panel',
  component: WfoPanel,
  args: { children: 'Content inside a panel.', padding: 200 },
  argTypes: { padding: { control: 'inline-radio', options: [0, 50, 100, 150, 200, 300] } },
};
export default meta;

/** Change padding in the controls. */
export const Default: StoryObj<typeof WfoPanel> = {};
