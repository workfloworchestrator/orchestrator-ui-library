import type { Meta } from '@storybook/react';
import { WFONoResults } from './WFONoResults'

const Story: Meta<typeof WFONoResults> = {
    component: WFONoResults,
    title: 'WFONoResult',
};
export default Story;

export const Default = {
    args: {
        icon: '',
        text: 'No results text'
    },
};
