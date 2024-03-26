import React from 'react';

import { useRouter } from 'next/router';

import { WfoSubscription } from '@/components';
import { TreeProvider } from '@/contexts';

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
