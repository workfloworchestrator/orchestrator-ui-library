import type { Meta } from '@storybook/react';
import { WFOInsyncIcon } from './WFOInsyncIcon';

const Story: Meta<typeof WFOInsyncIcon> = {
    component: WFOInsyncIcon,
    title: 'WFOInsyncIcon',
};
export default Story;

export const Default = {
    args: {
        inSync: true,
    },
};

export const DefaultOutofSync = {
    args: {
        inSync: false,
    },
};
