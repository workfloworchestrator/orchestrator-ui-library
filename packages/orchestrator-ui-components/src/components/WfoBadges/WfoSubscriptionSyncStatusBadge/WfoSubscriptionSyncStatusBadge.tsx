import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '../../../hooks';
import { WfoBadge } from '../WfoBadge';

export type WfoSubscriptionSyncStatusBadgeProps = {
    insync: boolean;
};

export const WfoSubscriptionSyncStatusBadge: FC<
    WfoSubscriptionSyncStatusBadgeProps
> = ({ insync }) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const t = useTranslations('common');

    const getBadgeColorFromStatus = (insync: boolean) => {
        const { danger, dangerText, success, successText } = theme.colors;

        if (insync) {
            return {
                badgeColor: toSecondaryColor(success),
                textColor: successText,
                // insyncText: 'in-sync',
                insyncText: t('insyncTrue'),
            };
        } else {
            return {
                badgeColor: toSecondaryColor(danger),
                textColor: dangerText,
                // insyncText: 'out-of-sync',
                insyncText: t('insyncFalse'),
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
