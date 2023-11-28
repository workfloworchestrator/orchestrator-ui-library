import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartProcessPage = () => {
    const router = useRouter();
    const { processName } = router.query;

    if (processName && typeof processName === 'string') {
        return (
            <WfoStartWorkflowPage isTask={false} workflowName={processName} />
        );
    }

    return <div>Invalid arguments provided</div>;
};

export default StartProcessPage;
