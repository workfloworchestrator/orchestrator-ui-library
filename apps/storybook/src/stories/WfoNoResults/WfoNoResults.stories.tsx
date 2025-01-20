import {
    WfoNoResults,
    WfoSearchStrikethrough,
} from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

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
