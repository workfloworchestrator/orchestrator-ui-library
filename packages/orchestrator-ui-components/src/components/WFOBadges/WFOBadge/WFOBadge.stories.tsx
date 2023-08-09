import type { Meta } from '@storybook/react';
import { WFOBadge } from './WFOBadge';

const Story: Meta<typeof WFOBadge> = {
    component: WFOBadge,
    title: 'Badges/WFOBadge',
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
