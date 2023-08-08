import React from 'react';
import type { Meta } from '@storybook/react';
import { WFOSidebar } from './WFOSidebar';

const Story: Meta<typeof WFOSidebar> = {
    component: (args) => (
        <div style={{ width: '250px', backgroundColor: '#F1F5F9' }}>
            <WFOSidebar {...args} />
        </div>
    ),
    title: 'PageTemplate/WFOSidebar',
};
export default Story;

export const Default = {
    args: {},
};
