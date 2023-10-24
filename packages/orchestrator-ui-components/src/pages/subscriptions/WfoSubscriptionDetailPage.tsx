import React from 'react';
import { WfoSubscription } from '../../components';
import { useRouter } from 'next/router';
import { TreeProvider } from '../../contexts';

export const WfoSubscriptionDetailPage = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;

    return (
        (subscriptionId && (
            <TreeProvider>
                <WfoSubscription subscriptionId={subscriptionId as string} />
            </TreeProvider>
        )) || <></>
    );
};
