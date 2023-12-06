import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartProcessPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName } = router.query;

    if (workflowName && typeof workflowName === 'string') {
        return (
            <WfoStartProcessPage isTask={false} processName={workflowName} />
        );
    }

    return <div>Invalid arguments provided</div>;
};

export default StartWorkflowPage;
