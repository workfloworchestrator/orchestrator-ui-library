import React from 'react';
import { FC } from 'react';

import Link from 'next/link';

import { EuiFlexGroup } from '@elastic/eui';

import { WfoBadge } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { Subscription } from '@/types';

export const RENDER_ALL = 'RENDER_ALL';
export enum RenderDirection {
    HORIZONTAL = 'HORIZONTAL',
    VERTICAL = 'VERTICAL',
}

export type WfoProcessesListSubscriptionsCellProps = {
    subscriptions: Pick<Subscription, 'subscriptionId' | 'description'>[];
    numberOfSubscriptionsToRender?: number | typeof RENDER_ALL;
    renderDirection?: RenderDirection;
    onMoreSubscriptionsClick?: () => void;
};

export const WfoProcessListSubscriptionsCell: FC<
    WfoProcessesListSubscriptionsCellProps
> = ({
    subscriptions,
    numberOfSubscriptionsToRender = RENDER_ALL,
    renderDirection = RenderDirection.HORIZONTAL,
    onMoreSubscriptionsClick = () => {},
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

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
                alignItems="center"
                gutterSize={
                    renderDirection === RenderDirection.HORIZONTAL ? 's' : 'xs'
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
                    <WfoBadge
                        textColor={theme.colors.primaryText}
                        color={toSecondaryColor(theme.colors.primary)}
                        onClick={() => onMoreSubscriptionsClick()}
                        iconOnClick={() => onMoreSubscriptionsClick()}
                        onClickAriaLabel={
                            'toDo: Show all related subscriptions'
                        }
                        iconOnClickAriaLabel={
                            'toDo: Show all related subscriptions'
                        }
                    >
                        + {numberOfNotVisibleSubscriptions}
                    </WfoBadge>

                    // <div
                    //     css={{
                    //         backgroundColor: 'hotpink',
                    //         padding: '3px',
                    //         borderRadius: '50%',
                    //         fontSize: '0.75rem',
                    //         // flex: '0 0 auto',
                    //     }}
                    // >
                    //     {`+${numberOfNotVisibleSubscriptions}`}
                    // </div>
                )}
            </EuiFlexGroup>
        </>
    );
};
