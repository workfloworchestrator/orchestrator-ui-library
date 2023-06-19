import type { Meta } from '@storybook/react';
import {
    OrchestratorSidebar,
    OrchestratorSidebarProps,
} from '@orchestrator-ui/orchestrator-ui-components';

const Story: Meta<typeof OrchestratorSidebar> = {
    component: (args: OrchestratorSidebarProps) => (
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
