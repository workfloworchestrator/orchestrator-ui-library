import React from 'react';
import type { Meta } from '@storybook/react';
import { WfoNoResults } from './WfoNoResults';
import { WfoSearchStrikethrough } from './../../icons';

const Story: Meta<typeof WfoNoResults> = {
    component: WfoNoResults,
    title: 'WfoNoResult',
};
export default Story;

export const Default = {
    args: {
        icon: <WfoSearchStrikethrough />,
        text: 'No results text',
    },
};
