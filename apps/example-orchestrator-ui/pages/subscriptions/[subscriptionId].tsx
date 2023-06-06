import { useRouter } from 'next/router';
import React from 'react';

import NoSSR from 'react-no-ssr';
import { Subscription } from '../../components/Subscription/Subscription';
import { TreeProvider } from '@orchestrator-ui/orchestrator-ui-components';
import { SubscriptionProvider } from '@orchestrator-ui/orchestrator-ui-components';

const SubscriptionDetailPage = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;
    return (
        <NoSSR>
            <SubscriptionProvider>
                <TreeProvider>
                    {subscriptionId && (
                        <Subscription
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
