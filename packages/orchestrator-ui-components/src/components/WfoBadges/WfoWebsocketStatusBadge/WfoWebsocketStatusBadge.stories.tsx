import type { Meta } from '@storybook/react';

import { WfoWebsocketStatusBadge } from './WfoWebsocketStatusBadge';

const Story: Meta<typeof WfoWebsocketStatusBadge> = {
    component: WfoWebsocketStatusBadge,
    title: 'Badges/WfoWebsocketStatusBadge',
};
export default Story;

export const Primary = {
    args: {},
};
