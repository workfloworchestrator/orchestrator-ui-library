import React from 'react';
import { useRouter } from 'next/router';
import { WFOStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName, productId } = router.query;

    if (workflowName && productId) {
        return (
            <WFOStartWorkflowPage
                workflowName={workflowName as string}
                productId={productId as string}
            />
        );
    }
    return <div>STOP: HAMMERTIME!</div>;
};

export default StartWorkflowPage;
