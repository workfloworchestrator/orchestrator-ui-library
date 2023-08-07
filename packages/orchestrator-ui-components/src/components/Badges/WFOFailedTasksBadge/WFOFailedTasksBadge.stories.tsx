import type { Meta } from '@storybook/react';
import { WFOFailedTasksBadge } from './WFOFailedTasksBadge';

const Story: Meta<typeof WFOFailedTasksBadge> = {
    component: WFOFailedTasksBadge,
    title: 'Badges/WFOFailedTasksBadge',
};
export default Story;

export const Primary = {
    args: {},
};
