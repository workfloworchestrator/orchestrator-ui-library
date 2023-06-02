import type { Meta } from '@storybook/react';
import { FrequentlyUsed } from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof FrequentlyUsed> = {
    component: FrequentlyUsed,
    title: 'StartPage/FrequentlyUsed',
    tags: ['autodocs'],
};
export default Story;

export const Primary = {
    args: {
        values: ['Internal User', 'External User', 'Group'],
    },
};
