import type { Meta } from '@storybook/react';
import { WFOProductStatusBadge } from './WFOProductStatusBadge';
import { ProductLifecycleStatus } from '../../../types';

const Story: Meta<typeof WFOProductStatusBadge> = {
    component: WFOProductStatusBadge,
    title: 'Badges/WFOProductStatusBadge',
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
