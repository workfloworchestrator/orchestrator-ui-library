import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { SubscriptionStatus } from '../../../types';
import { WfoBadge } from '../WfoBadge';

export type WfoSubscriptionStatusBadgeProps = {
    status: SubscriptionStatus;
};

export const WfoSubscriptionStatusBadge: FC<
    WfoSubscriptionStatusBadgeProps
> = ({ status }) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const lowerCaseStatus = status?.toLowerCase() || '';

    const getBadgeColorFromStatus = () => {
        const {
            primary,
            darkestShade,
            lightShade,
            primaryText,
            success,
            successText,
        } = theme.colors;

        switch (lowerCaseStatus) {
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

    const { badgeColor, textColor } = getBadgeColorFromStatus();

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {lowerCaseStatus}
        </WfoBadge>
    );
};
