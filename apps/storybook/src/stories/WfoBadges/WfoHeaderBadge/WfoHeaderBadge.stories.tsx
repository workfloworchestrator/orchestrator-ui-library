import { WfoHeaderBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

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
