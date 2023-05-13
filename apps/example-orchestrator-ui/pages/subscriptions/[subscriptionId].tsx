// The final implementation of this component happens in a different story
// @ts-nocheck
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
                    <Subscription subscriptionId={subscriptionId} />
                </TreeProvider>
            </SubscriptionProvider>
        </NoSSR>
    );
};

export default SubscriptionDetailPage;
