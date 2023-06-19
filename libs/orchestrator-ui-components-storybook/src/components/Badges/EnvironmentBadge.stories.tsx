import type { Meta } from '@storybook/react';
import {
    EnvironmentBadge,
    BadgeProps,
} from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof EnvironmentBadge> = {
    component: (args: BadgeProps) => (
        <div style={{ display: 'flex' }}>
            <EnvironmentBadge {...args} />
        </div>
    ),
    title: 'Badges/EnvironmentBadge',
};
export default Story;

export const Primary = {
    args: {},
};
