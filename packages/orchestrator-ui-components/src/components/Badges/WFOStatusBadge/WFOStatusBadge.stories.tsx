import type { Meta } from '@storybook/react';
import { WFOStatusBadge } from './WFOStatusBadge';

const Story: Meta<typeof WFOStatusBadge> = {
    component: WFOStatusBadge,
    title: 'Badges/StatusBadge',
};
export default Story;

export const Default = {
    args: {
        status: 'default badge',
    },
};

export const Active = {
    args: {
        status: 'active',
    },
};

export const Terminated = {
    args: {
        status: 'terminated',
    },
};
