import React from 'react';
import type { Meta } from '@storybook/react';
import ListItemStartPage from './ListItemStartPage';

const Story: Meta<typeof ListItemStartPage> = {
    component: ListItemStartPage,
    title: 'StartPage/ListItemStartPage',
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div onClick={(e) => e.preventDefault()}>
                <Story />
            </div>
        ),
    ],
};
export default Story;

export const Subscription = {
    args: {
        item: {
            subscription_id: '8993297c-1bc6-4acf-aec1-056e75edabc0',
            product: { name: 'test product' },
        },
        type: 'subscription',
    },
};

export const Process = {
    args: {
        item: {
            subscription_id: '1234597c-1bc6-4acf-aec1-056e75edabc0',
            workflow: 'test process',
            last_modified_at: 1678819904.344238,
        },
        type: 'process',
    },
};
