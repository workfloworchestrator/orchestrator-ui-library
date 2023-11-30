import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName } = router.query;

    if (workflowName && typeof workflowName === 'string') {
        return (
            <WfoStartWorkflowPage isTask={false} workflowName={workflowName} />
        );
    }

    return <div>Invalid arguments provided</div>;
};

export default StartWorkflowPage;
