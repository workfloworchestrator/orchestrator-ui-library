import React from 'react';
import type { Meta } from '@storybook/react';
import { WFONoResults } from './WFONoResults';
import { WFOSearchStrikethrough } from './../../icons';

const Story: Meta<typeof WFONoResults> = {
    component: WFONoResults,
    title: 'WFONoResult',
};
export default Story;

export const Default = {
    args: {
        icon: <WFOSearchStrikethrough />,
        text: 'No results text',
    },
};
