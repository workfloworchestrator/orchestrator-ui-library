import type { Meta } from '@storybook/react';

import { WfoFrequentlyUsed } from './WfoFrequentlyUsed';

const Story: Meta<typeof WfoFrequentlyUsed> = {
    component: WfoFrequentlyUsed,
    title: 'StartPage/WfoFrequentlyUsed',
    tags: ['autodocs'],
};
export default Story;

export const Primary = {
    args: {
        values: ['Internal User', 'External User', 'Group'],
    },
};
