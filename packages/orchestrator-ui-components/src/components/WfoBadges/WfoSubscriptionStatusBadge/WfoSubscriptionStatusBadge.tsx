import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { SubscriptionStatus } from '../../../types';
import { WfoBadge } from '../WfoBadge';

export type WfoSubscriptionStatusBadgeProps = {
    status?: SubscriptionStatus;
};

export const WfoSubscriptionStatusBadge: FC<
    WfoSubscriptionStatusBadgeProps
> = ({ status }) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const lowerCaseStatus = status?.toLowerCase() || '';

    const getBadgeColorFromStatus = () => {
        const {
            primary,
            borderBaseSubdued,
            textParagraph,
            textPrimary,
            success,
            textSuccess,
        } = theme.colors;

        switch (lowerCaseStatus) {
            case SubscriptionStatus.ACTIVE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: textSuccess,
                };
            case SubscriptionStatus.TERMINATED:
                return {
                    badgeColor: borderBaseSubdued,
                    textColor: textParagraph,
                };

            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: textPrimary,
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
