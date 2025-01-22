import { WfoEngineStatusBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof WfoEngineStatusBadge> = {
    component: (args) => (
        <div style={{ display: 'block' }}>
            <WfoEngineStatusBadge {...args} />
        </div>
    ),
    title: 'Badges/WfoEngineStatusBadge',
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
