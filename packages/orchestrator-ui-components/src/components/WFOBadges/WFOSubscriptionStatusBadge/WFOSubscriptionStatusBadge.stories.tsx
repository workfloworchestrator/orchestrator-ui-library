import type { Meta } from '@storybook/react';
import { WFOSubscriptionStatusBadge } from './WFOSubscriptionStatusBadge';

const Story: Meta<typeof WFOSubscriptionStatusBadge> = {
    component: WFOSubscriptionStatusBadge,
    title: 'Badges/WFOSubscriptionStatusBadge',
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
