import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

import type { WfoCallOutColor } from './WfoCallOut';

export const getWfoCallOutStyles = ({ theme }: WfoThemeHelpers) => {
  const titleColors: Record<WfoCallOutColor, string> = {
    primary: theme.colors.textPrimary,
    success: theme.colors.textSuccess,
    warning: theme.colors.textWarning,
    danger: theme.colors.textDanger,
  };

  const getTitleStyle = (color: WfoCallOutColor) =>
    css({
      fontWeight: theme.font.weight.medium,
      // In case it's nested inside EuiText
      marginBottom: '0 !important',
      color: titleColors[color],
    });

  const iconStyle = css({
    position: 'relative',
    top: '-1px',
    marginRight: theme.size.s,
  });

  return { getTitleStyle, iconStyle };
};
