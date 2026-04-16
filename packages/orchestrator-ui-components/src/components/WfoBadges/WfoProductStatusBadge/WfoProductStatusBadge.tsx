import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { ProductLifecycleStatus } from '../../../types';
import { WfoBadge } from '../WfoBadge';

export type WfoProductStatusBadgeProps = {
  status: ProductLifecycleStatus;
};

const normalizedStatus = (status: ProductLifecycleStatus): string => status.toLowerCase().replace(/_/g, ' ');

export const WfoProductStatusBadge: FC<WfoProductStatusBadgeProps> = ({ status }) => {
  const { theme, toSecondaryColor } = useOrchestratorTheme();

  const productLifeCycleStatus = normalizedStatus(status);
  const getBadgeColorFromStatus = () => {
    const { primary, borderBaseSubdued, textPrimary, textParagraph, success, textSuccess } = theme.colors;

    switch (productLifeCycleStatus) {
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

  const { badgeColor, textColor } = getBadgeColorFromStatus();

  return (
    <WfoBadge textColor={textColor} color={badgeColor}>
      {productLifeCycleStatus}
    </WfoBadge>
  );
};
