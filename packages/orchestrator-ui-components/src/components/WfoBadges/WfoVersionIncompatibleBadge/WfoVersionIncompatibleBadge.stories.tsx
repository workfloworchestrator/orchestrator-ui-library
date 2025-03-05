import React from 'react';

import type { Meta } from '@storybook/react';

import { WfoVersionIncompatibleBadge } from './WfoVersionIncompatibleBadge';

const Story: Meta<typeof WfoVersionIncompatibleBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WfoVersionIncompatibleBadge {...args} />
        </div>
    ),
    title: 'Badges/WfoVersionIncompatibleBadge',
};
export default Story;

export const Primary = {
    args: {},
};
