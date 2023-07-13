import type { Meta } from '@storybook/react';
import { WFOProductBlockBadge } from './WFOProductBlockBadge';

const Story: Meta<typeof WFOProductBlockBadge> = {
    component: WFOProductBlockBadge,
    title: 'Badges/ProductBlockBadge',
};

export default Story;

export const Default = {
    args: {
        children: 'Product block',
    },
};
