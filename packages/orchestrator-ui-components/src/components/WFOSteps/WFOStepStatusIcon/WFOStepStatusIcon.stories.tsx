import type { Meta } from '@storybook/react';
import { WFOStepStatusIcon } from './WFOStepStatusIcon';

const Story: Meta<typeof WFOStepStatusIcon> = {
    component: WFOStepStatusIcon,
    title: 'Steps/WFOStepStatusIcon',
};
export default Story;

export const Default = {
    args: {
        steps: 1,
        status: 2,
    },
};
