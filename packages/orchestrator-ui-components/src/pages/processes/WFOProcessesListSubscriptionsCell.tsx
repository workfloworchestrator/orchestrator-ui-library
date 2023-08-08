import React from 'react';
import { Subscription } from '../../types';
import Link from 'next/link';
import { FC } from 'react';

export type WFOProcessesListSubscriptionsCellProps = {
    subscriptions: Pick<Subscription, 'subscriptionId' | 'description'>[];
};

export const WFOProcessesListSubscriptionsCell: FC<
    WFOProcessesListSubscriptionsCellProps
> = ({ subscriptions }) => {
    const { length } = subscriptions;

    if (length === 0) {
        return null;
    }

    const firstSubscription = subscriptions[0];
    return (
        <>
            <Link href={`/subscriptions/${firstSubscription.subscriptionId}`}>
                {firstSubscription.description}
            </Link>
            {length > 1 && <span>{` (+${length - 1})`}</span>}
        </>
    );
};
