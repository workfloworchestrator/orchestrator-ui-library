import { WFOBadge } from '../WFOBadge';
import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';
import { SubscriptionStatus } from '../../../types';

export type WFOSubscriptionStatusBadgeProps = {
    status: SubscriptionStatus;
};

export const WFOSubscriptionStatusBadge: FC<
    WFOSubscriptionStatusBadgeProps
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

        switch (status) {
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
        <WFOBadge textColor={textColor} color={badgeColor}>
            {status}
        </WFOBadge>
    );
};
