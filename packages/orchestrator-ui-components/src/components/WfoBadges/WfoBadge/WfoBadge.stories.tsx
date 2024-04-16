import type { Meta } from '@storybook/react';

import { WfoBadge } from './WfoBadge';

const Story: Meta<typeof WfoBadge> = {
    component: WfoBadge,
    title: 'Badges/WfoBadge',
    argTypes: {
        textColor: {
            control: 'color',
            description: 'Color of the text inside the badge',
        },
        size: {
            control: { type: 'select' },
            options: ['xs', 's', 'm', 'relative'],
        },
    },
    args: {
        size: 'm',
    },
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
