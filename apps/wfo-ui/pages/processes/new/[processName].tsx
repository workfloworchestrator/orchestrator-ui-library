import React from 'react';

import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import { WfoStartWorkflowPage } from '@orchestrator-ui/orchestrator-ui-components';

// todo this type is now duplocated with StartWorkflowPage -- fix this
interface StartWorkflowPageQuery extends ParsedUrlQuery {
    processName: string; // except this one
    productId?: string;
    subscriptionId?: string;
}

const StartProcessPage = () => {
    const router = useRouter();
    const { processName, productId, subscriptionId } =
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
    if (processName) {
        return (
            <WfoStartWorkflowPage
                isTask={false}
                workflowName={processName}
                startWorkflowPayload={startWorkflowPayload}
            />
        );
    }
    return <div>Not enough arguments provided</div>;
};

export default StartProcessPage;
