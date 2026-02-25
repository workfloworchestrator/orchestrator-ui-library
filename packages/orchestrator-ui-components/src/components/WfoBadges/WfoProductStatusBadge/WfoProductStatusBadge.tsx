import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { ProductLifecycleStatus } from '../../../types';
import { WfoBadge } from '../WfoBadge';

export type WfoProductStatusBadgeProps = {
  status: ProductLifecycleStatus;
};

export const WfoProductStatusBadge: FC<WfoProductStatusBadgeProps> = ({ status }) => {
  const { theme, toSecondaryColor } = useOrchestratorTheme();

  const getBadgeColorFromStatus = (status: string) => {
    const { primary, borderBaseSubdued, textPrimary, textParagraph, success, textSuccess } = theme.colors;

    switch (status.toLowerCase()) {
      case ProductLifecycleStatus.ACTIVE:
        return {
          badgeColor: toSecondaryColor(success),
          textColor: textSuccess,
        };
      case ProductLifecycleStatus.END_OF_LIFE:
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

  const { badgeColor, textColor } = getBadgeColorFromStatus(status);

  return (
    <WfoBadge textColor={textColor} color={badgeColor}>
      {status.toLowerCase()}
    </WfoBadge>
  );
};
