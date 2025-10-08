import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoHeaderBadge } from './WfoHeaderBadge';

const Story: Meta<typeof WfoHeaderBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WfoHeaderBadge {...args} />
        </div>
    ),
    title: 'Badges/WfoHeaderBadge',
};
export default Story;

export const Primary = {
    args: {
        children: 'Badge text',
    },
};
