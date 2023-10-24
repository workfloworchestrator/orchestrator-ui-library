import React from 'react';
import { useRouter } from 'next/router';
import { WfoStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';
import { ParsedUrlQuery } from 'querystring';

interface StartWorkflowPageQuery extends ParsedUrlQuery {
    workflowName: string;
    productId?: string;
    subscriptionId?: string;
}

const StartWorkflowPage = () => {
    const router = useRouter();
    const { workflowName, productId, subscriptionId } =
        router.query as StartWorkflowPageQuery;

    const getStartWorkflowPayload = () => {
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
    const startWorkflowPayload = getStartWorkflowPayload();
    if (workflowName) {
        return (
            <WfoStartWorkflowPage
                workflowName={workflowName}
                startWorkflowPayload={startWorkflowPayload}
            />
        );
    }
    return <div>Not enough arguments provided</div>;
};

export default StartWorkflowPage;
