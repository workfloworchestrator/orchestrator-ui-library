import { useRouter } from 'next/router';
import React from 'react';

import NoSSR from 'react-no-ssr';
import {
    WFOSubscription,
    TreeProvider,
    SubscriptionProvider,
} from '@orchestrator-ui/orchestrator-ui-components';

const SubscriptionDetailPage = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;
    return (
        <NoSSR>
            <SubscriptionProvider>
                <TreeProvider>
                    {subscriptionId && (
                        <WFOSubscription
                            subscriptionId={
                                Array.isArray(subscriptionId)
                                    ? subscriptionId[0]
                                    : subscriptionId
                            }
                        />
                    )}
                </TreeProvider>
            </SubscriptionProvider>
        </NoSSR>
    );
};

export default SubscriptionDetailPage;
