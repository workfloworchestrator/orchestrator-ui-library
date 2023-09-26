import React from 'react';
import { useRouter } from 'next/router';
import { WFOStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';
import { ParsedUrlQuery } from 'querystring';

interface StartWorkFlowPageQuery extends ParsedUrlQuery {
    workflowName: string;
    productId?: string;
    subscriptionId?: string;
}

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName, productId, subscriptionId } =
        router.query as StartWorkFlowPageQuery;

    if (workflowName && (productId || subscriptionId)) {
        return (
            <WFOStartWorkflowPage
                workflowName={workflowName}
                productId={productId}
                subscriptionId={subscriptionId}
            />
        );
    }
    return <div>Not enough arguments provided</div>;
};

export default StartWorkflowPage;
