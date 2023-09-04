import React from 'react';
import { SubscriptionProvider, TreeProvider } from '../../contexts';
import { WFOSubscription } from '../../components';
import { useRouter } from 'next/router';

export const WFOSubscriptionDetailPage = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;

    return (
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
    );
};
