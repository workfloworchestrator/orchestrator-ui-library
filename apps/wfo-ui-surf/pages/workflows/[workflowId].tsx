import React from 'react';

import { useRouter } from 'next/router';

import { WfoProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

const WorkflowDetailPage = () => {
    const router = useRouter();
    const { workflowId } = router.query;

    return (
        <>
            {(workflowId && typeof workflowId === 'string' && (
                <WfoProcessDetailPage processId={workflowId} />
            )) || <div>Invalid workflowId</div>}
        </>
    );
};

export default WorkflowDetailPage;
