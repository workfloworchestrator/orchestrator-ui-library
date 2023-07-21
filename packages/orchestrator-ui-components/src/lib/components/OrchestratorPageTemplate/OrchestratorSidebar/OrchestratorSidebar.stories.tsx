import type { Meta } from '@storybook/react';
import { OrchestratorSidebar } from './OrchestratorSidebar';

const Story: Meta<typeof OrchestratorSidebar> = {
    component: (args) => (
        <div style={{ width: '250px', backgroundColor: '#F1F5F9' }}>
            <OrchestratorSidebar {...args} />
        </div>
    ),
    title: 'PageTemplate/OrchestratorSidebar',
};
export default Story;

export const Default = {
    args: {},
};
