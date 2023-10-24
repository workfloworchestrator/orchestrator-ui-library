import type { Meta } from '@storybook/react';
import { WfoProductStatusBadge } from './WfoProductStatusBadge';
import { ProductLifecycleStatus } from '../../../types';

const Story: Meta<typeof WfoProductStatusBadge> = {
    component: WfoProductStatusBadge,
    title: 'Badges/WfoProductStatusBadge',
};
export default Story;

export const Default = {
    args: {
        status: ProductLifecycleStatus.ACTIVE,
    },
};

export const Terminated = {
    args: {
        status: ProductLifecycleStatus.END_OF_LIFE,
    },
};
