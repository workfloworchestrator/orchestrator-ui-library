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

    const getStartWorkFlowPayload = () => {
        if (productId) {
            return {
                product: productId,
            };
        }

        if (subscriptionId) {
            return {
                subscription_id: subscriptionId,
            };
        }
        return undefined;
    };
    const startWorkflowPayload = getStartWorkFlowPayload();
    if (workflowName) {
        return (
            <WFOStartWorkflowPage
                workflowName={workflowName}
                startWorkflowPayload={startWorkflowPayload}
            />
        );
    }
    return <div>Not enough arguments provided</div>;
};

export default StartWorkflowPage;
