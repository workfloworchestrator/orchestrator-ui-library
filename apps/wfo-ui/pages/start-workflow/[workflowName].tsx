import React from 'react';
import { useRouter } from 'next/router';
import { WFOStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName: workflowNameQueryParameter } = router.query;

    const workflowName = Array.isArray(workflowNameQueryParameter)
        ? workflowNameQueryParameter[0]
        : workflowNameQueryParameter;

    return <WFOStartWorkflowPage workflowName={workflowName || ''} />;
};

export default StartWorkflowPage;
