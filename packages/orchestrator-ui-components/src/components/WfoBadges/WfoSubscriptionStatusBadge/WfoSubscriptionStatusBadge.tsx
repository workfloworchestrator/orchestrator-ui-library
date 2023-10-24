import { WfoBadge } from '../WfoBadge';
import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';
import { SubscriptionStatus } from '../../../types';

export type WfoSubscriptionStatusBadgeProps = {
    status: SubscriptionStatus;
};

export const WfoSubscriptionStatusBadge: FC<
    WfoSubscriptionStatusBadgeProps
> = ({ status }) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromStatus = (status: string) => {
        const {
            primary,
            darkestShade,
            lightShade,
            primaryText,
            success,
            successText,
        } = theme.colors;

        switch (status.toLowerCase()) {
            case SubscriptionStatus.ACTIVE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case SubscriptionStatus.TERMINATED:
                return {
                    badgeColor: lightShade,
                    textColor: darkestShade,
                };

            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
        }
    };

    const { badgeColor, textColor } = getBadgeColorFromStatus(status);

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {status.toLowerCase()}
        </WfoBadge>
    );
};
