import React from 'react';
import { WFOSubscription } from '../../components';
import { useRouter } from 'next/router';

export const WFOSubscriptionDetailPage = () => {
    const router = useRouter();
    const { subscriptionId } = router.query;

    return <WFOSubscription subscriptionId={subscriptionId as string} />;
};
