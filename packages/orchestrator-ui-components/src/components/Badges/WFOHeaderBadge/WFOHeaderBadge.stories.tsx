import React from 'react';
import type { Meta } from '@storybook/react';
import { WFOHeaderBadge } from './WFOHeaderBadge';

const Story: Meta<typeof WFOHeaderBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WFOHeaderBadge {...args} />
        </div>
    ),
    title: 'Badges/WFOHeaderBadge',
};
export default Story;

export const Primary = {
    args: {
        children: 'Badge text',
    },
};
