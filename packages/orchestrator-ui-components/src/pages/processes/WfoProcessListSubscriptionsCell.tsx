import React from 'react';
import { Subscription } from '../../types';
import Link from 'next/link';
import { FC } from 'react';
import { EuiFlexGroup } from '@elastic/eui';

export const RENDER_ALL = 'RENDER_ALL';
export enum RenderDirection {
    HORIZONTAL = 'HORIZONTAL',
    VERTICAL = 'VERTICAL',
}

export type WFOProcessesListSubscriptionsCellProps = {
    subscriptions: Pick<Subscription, 'subscriptionId' | 'description'>[];
    numberOfSubscriptionsToRender?: number | typeof RENDER_ALL;
    renderDirection?: RenderDirection;
};

export const WFOProcessListSubscriptionsCell: FC<
    WFOProcessesListSubscriptionsCellProps
> = ({
    subscriptions,
    numberOfSubscriptionsToRender = RENDER_ALL,
    renderDirection = RenderDirection.HORIZONTAL,
}) => {
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

    return (
        <>
            <EuiFlexGroup
                direction={
                    renderDirection === RenderDirection.HORIZONTAL
                        ? 'row'
                        : 'column'
                }
                gutterSize={
                    renderDirection === RenderDirection.HORIZONTAL ? 'm' : 'xs'
                }
            >
                {visibleSubscriptions.map((subscription) => (
                    <Link
                        key={subscription.subscriptionId}
                        href={`/subscriptions/${subscription.subscriptionId}`}
                        css={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {subscription.description}
                    </Link>
                ))}
                {numberOfNotVisibleSubscriptions > 0 && (
                    <span>{`(+${numberOfNotVisibleSubscriptions})`}</span>
                )}
            </EuiFlexGroup>
        </>
    );
};
