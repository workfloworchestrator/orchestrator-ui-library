import { WfoSubscriptionSyncStatusBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof WfoSubscriptionSyncStatusBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WfoSubscriptionSyncStatusBadge {...args} />
        </div>
    ),
    title: 'Badges/WfoSubscriptionSyncStatusBadge',
};
export default Story;

export const Primary = {
    args: {
        insync: true,
    },
};

export const Secondary = {
    args: {
        insync: false,
    },
};
