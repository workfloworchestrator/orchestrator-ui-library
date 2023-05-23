import type { Meta } from '@storybook/react';
import { FailedTasksBadge } from './FailedTasksBadge';

const Story: Meta<typeof FailedTasksBadge> = {
    component: FailedTasksBadge,
    title: 'Badges/FailedTasksBadge',
};
export default Story;

export const Primary = {
    args: {},
};
