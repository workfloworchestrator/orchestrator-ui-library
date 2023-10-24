import React from 'react';
import { WFOSubscription } from '../../components';
import { useRouter } from 'next/router';
import { TreeProvider } from '../../contexts';

export const WFOSubscriptionDetailPage = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;

    return (
        (subscriptionId && (
            <TreeProvider>
                <WFOSubscription subscriptionId={subscriptionId as string} />
            </TreeProvider>
        )) || <></>
    );
};
