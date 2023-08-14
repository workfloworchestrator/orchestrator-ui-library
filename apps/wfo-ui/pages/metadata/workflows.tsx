import React from 'react';
import { WFOWorkflowsPage } from '@orchestrator-ui/orchestrator-ui-components';
import NoSSR from 'react-no-ssr';

export const WorkflowsPage = () => (
    <NoSSR>
        <WFOWorkflowsPage />
    </NoSSR>
);

export default WorkflowsPage;
