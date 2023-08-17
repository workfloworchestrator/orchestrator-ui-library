import { WFOBadge } from '../WFOBadge';
import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';

export type WFOSubscriptionStatusBadgeProps = {
    status: string;
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

        switch (status.toLowerCase()) {
            case 'active':
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case 'terminated':
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
