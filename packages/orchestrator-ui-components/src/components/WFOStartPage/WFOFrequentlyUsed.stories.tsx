import type { Meta } from '@storybook/react';
import { WFOFrequentlyUsed } from './WFOFrequentlyUsed';

const Story: Meta<typeof WFOFrequentlyUsed> = {
    component: WFOFrequentlyUsed,
    title: 'StartPage/WFOFrequentlyUsed',
    tags: ['autodocs'],
};
export default Story;

export const Primary = {
    args: {
        values: ['Internal User', 'External User', 'Group'],
    },
};
