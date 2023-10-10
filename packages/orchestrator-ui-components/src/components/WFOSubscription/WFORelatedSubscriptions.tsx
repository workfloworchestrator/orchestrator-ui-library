import React from 'react';
import { SubscriptionDetail } from '../../types';

interface WFORelatedSubscriptionsProps {
    subscriptionDetail: SubscriptionDetail;
}

export const WFORelatedSubscriptions = ({
    subscriptionDetail,
}: WFORelatedSubscriptionsProps) => {
    const relatedSubscriptions =
        subscriptionDetail &&
        subscriptionDetail.inUseBySubscriptions &&
        subscriptionDetail.inUseBySubscriptions.page;

    return (
        (relatedSubscriptions && relatedSubscriptions.length > 0 && (
            <div>Yes</div>
        )) || <div>No</div>
    );
};
