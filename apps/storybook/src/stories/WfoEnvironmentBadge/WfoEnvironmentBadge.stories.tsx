import { WfoEnvironmentBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof WfoEnvironmentBadge> = {
    component: (args) => (
        <div style={{ display: 'flex' }}>
            <WfoEnvironmentBadge {...args} />
        </div>
    ),
    title: 'Badges/WfoEnvironmentBadge',
};
export default Story;

export const Primary = {
    args: {},
};
