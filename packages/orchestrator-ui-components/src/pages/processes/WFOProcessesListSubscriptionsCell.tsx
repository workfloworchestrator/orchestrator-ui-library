import React from 'react';
import { Subscription } from '../../types';
import Link from 'next/link';
import { FC } from 'react';

export const RENDER_ALL = 'RENDER_ALL';

export type WFOProcessesListSubscriptionsCellProps = {
    subscriptions: Pick<Subscription, 'subscriptionId' | 'description'>[];
    numberOfSubscriptionsToRender?: number | typeof RENDER_ALL;
};

export const WFOProcessesListSubscriptionsCell: FC<
    WFOProcessesListSubscriptionsCellProps
> = ({ subscriptions, numberOfSubscriptionsToRender = RENDER_ALL }) => {
    const { length } = subscriptions;

    if (length === 0) {
        return null;
    }

    const visibleSubscriptions =
        numberOfSubscriptionsToRender === RENDER_ALL
            ? subscriptions
            : subscriptions.slice(0, numberOfSubscriptionsToRender);
    const numberOfNotVisibleSubscriptions =
        length - visibleSubscriptions.length;

    // todo: Rendering multiple links will end up in 1 line with links
    return (
        <>
            {visibleSubscriptions.map((subscription) => (
                <Link
                    key={subscription.subscriptionId}
                    href={`/subscriptions/${subscription.subscriptionId}`}
                >
                    {subscription.description}
                </Link>
            ))}

            {numberOfNotVisibleSubscriptions > 0 && (
                <span>{` (+${numberOfNotVisibleSubscriptions})`}</span>
            )}
        </>
    );
};
