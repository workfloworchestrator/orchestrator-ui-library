import type { Meta } from '@storybook/react';
import {
    HeaderBadge,
    HeaderBadgeProps,
} from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof HeaderBadge> = {
    component: (args: HeaderBadgeProps) => (
        <div style={{ display: 'flex' }}>
            <HeaderBadge {...args} />
        </div>
    ),
    title: 'Badges/HeaderBadge',
};
export default Story;

export const Primary = {
    args: {
        children: 'Badge text',
    },
};
