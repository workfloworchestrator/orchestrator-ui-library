import type { Meta } from '@storybook/react';
import { SubscriptionStatusBadge } from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof SubscriptionStatusBadge> = {
    component: SubscriptionStatusBadge,
    title: 'Badges/SubscriptionStatusBadge',
};
export default Story;

export const Default = {
    args: {
        subscriptionStatus: 'default badge',
    },
};

export const Active = {
    args: {
        subscriptionStatus: 'active',
    },
};

export const Terminated = {
    args: {
        subscriptionStatus: 'terminated',
    },
};
