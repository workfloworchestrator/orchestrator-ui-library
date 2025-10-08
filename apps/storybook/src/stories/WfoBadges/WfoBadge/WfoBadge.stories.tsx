import { WfoBadge } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof WfoBadge> = {
    component: WfoBadge,
    title: 'Badges/WfoBadge',
};
export default Story;

export const Default = {
    args: {
        children: 'Badge text',
    },
};

export const DefaultWithIcon = {
    args: {
        children: 'Badge text with icon',
    },
};
