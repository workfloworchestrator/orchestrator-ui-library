import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { WfoBadge } from '../WfoBadge';

export type WfoSubscriptionSyncStatusBadgeProps = {
    insync: boolean;
};

export const WfoSubscriptionSyncStatusBadge: FC<
    WfoSubscriptionSyncStatusBadgeProps
> = ({ insync }) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromStatus = (insync: boolean) => {
        const { danger, dangerText, success, successText } = theme.colors;

        if (insync) {
            return {
                badgeColor: toSecondaryColor(success),
                textColor: successText,
                insyncText: 'in-sync',
            };
        } else {
            return {
                badgeColor: toSecondaryColor(danger),
                textColor: dangerText,
                insyncText: 'out-of-sync',
            };
        }
    };

    const { badgeColor, textColor, insyncText } =
        getBadgeColorFromStatus(insync);

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {insyncText}
        </WfoBadge>
    );
};
