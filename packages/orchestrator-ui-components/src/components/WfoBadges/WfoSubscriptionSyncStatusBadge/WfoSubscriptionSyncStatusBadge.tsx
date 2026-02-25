import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '@/hooks';

import { WfoBadge } from '../WfoBadge';

export type WfoSubscriptionSyncStatusBadgeProps = {
  insync: boolean;
};

export const WfoSubscriptionSyncStatusBadge: FC<WfoSubscriptionSyncStatusBadgeProps> = ({ insync }) => {
  const { theme, toSecondaryColor } = useOrchestratorTheme();

  const t = useTranslations('common');

  const getBadgePropertiesFromStatus = (insync: boolean) => {
    const { danger, textDanger, success, textSuccess } = theme.colors;

    if (insync) {
      return {
        badgeColor: toSecondaryColor(success),
        textColor: textSuccess,
        insyncText: t('insyncTrue'),
      };
    } else {
      return {
        badgeColor: toSecondaryColor(danger),
        textColor: textDanger,
        insyncText: t('insyncFalse'),
      };
    }
  };

  const { badgeColor, textColor, insyncText } = getBadgePropertiesFromStatus(insync);

  return (
    <WfoBadge textColor={textColor} color={badgeColor}>
      {insyncText}
    </WfoBadge>
  );
};
