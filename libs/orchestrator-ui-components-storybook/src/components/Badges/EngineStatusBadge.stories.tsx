import type { Meta } from '@storybook/react';
import { EngineStatusBadge } from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof EngineStatusBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <EngineStatusBadge {...args} />
        </div>
    ),
    title: 'Badges/EngineStatusBadge',
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
