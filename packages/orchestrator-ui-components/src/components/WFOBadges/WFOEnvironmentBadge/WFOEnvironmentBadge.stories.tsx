import React from 'react';
import type { Meta } from '@storybook/react';
import { WFOEnvironmentBadge } from './WFOEnvironmentBadge';

const Story: Meta<typeof WFOEnvironmentBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WFOEnvironmentBadge {...args} />
        </div>
    ),
    title: 'Badges/WFOEnvironmentBadge',
};
export default Story;

export const Primary = {
    args: {},
};
