import React from 'react';
import type { Meta } from '@storybook/react';
import { WFOEngineStatusBadge } from './WFOEngineStatusBadge';

const Story: Meta<typeof WFOEngineStatusBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WFOEngineStatusBadge {...args} />
        </div>
    ),
    title: 'Badges/WFOEngineStatusBadge',
    parameters: {
        mockData: [
            {
                url: 'https://testing.test/settings/status',
                method: 'GET',
                status: 200,
                response: { global_status: 'RUNNING' },
            },
        ],
    },
};
export default Story;

export const Primary = {
    args: {},
};
