import {
    ProductLifecycleStatus,
    WfoProductStatusBadge,
} from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

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
