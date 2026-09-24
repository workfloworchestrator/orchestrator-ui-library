import { WfoWebsocketStatusBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react-vite';

const Story: Meta<typeof WfoWebsocketStatusBadge> = {
  component: WfoWebsocketStatusBadge,
  title: 'Badges/WfoWebsocketStatusBadge',
};
export default Story;

export const Primary = {
  args: {},
};
