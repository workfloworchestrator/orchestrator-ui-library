import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme, toSecondaryColor }: WfoThemeHelpers) => {
  const autoExpandableTextAreaStyles = css({
    width: '100%',
    maxInlineSize: '100%',
    height: 'auto',
    overflowY: 'hidden',
    resize: 'none',
    border: `thin solid ${toSecondaryColor(theme.colors.borderBasePlain)}`,
  });

  return {
    autoExpandableTextAreaStyles,
  };
};
