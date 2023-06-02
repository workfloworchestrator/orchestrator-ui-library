import type { Meta } from '@storybook/react';
import { Badge } from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof Badge> = {
    component: Badge,
    title: 'Badges/Badge',
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
        iconType: 'plus',
    },
};
