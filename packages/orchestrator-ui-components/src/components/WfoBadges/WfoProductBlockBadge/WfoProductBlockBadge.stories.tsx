import type { Meta } from '@storybook/react';

import { WfoProductBlockBadge } from './WfoProductBlockBadge';

const Story: Meta<typeof WfoProductBlockBadge> = {
    component: WfoProductBlockBadge,
    title: 'Badges/WfoProductBlockBadge',
};

export default Story;

export const Default = {
    args: {
        children: 'Product block',
    },
};
