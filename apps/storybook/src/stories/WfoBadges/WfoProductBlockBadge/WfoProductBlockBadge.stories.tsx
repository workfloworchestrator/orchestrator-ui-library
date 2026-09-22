import { WfoProductBlockBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react-vite';

const Story: Meta<typeof WfoProductBlockBadge> = {
  component: WfoProductBlockBadge,
  title: 'Badges/WfoProductBlockBadge',
};

export default Story;

export const Default = {
  args: {
    children: 'Product block',
  },
};
