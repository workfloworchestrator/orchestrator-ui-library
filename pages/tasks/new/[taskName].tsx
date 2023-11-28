import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartProcessPage = () => {
    const router = useRouter();
    const { taskName } = router.query;

    if (taskName && typeof taskName === 'string') {
        return <WfoStartWorkflowPage isTask={true} workflowName={taskName} />;
    }

    return <div>Invalid arguments provided</div>;
};

export default StartProcessPage;
