import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoSubscriptionSyncStatusBadge } from './WfoSubscriptionSyncStatusBadge';

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
