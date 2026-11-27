import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  // 12px between items, thin dividers; the items wrap to a new line on a narrow screen
  const infoLineStyle = css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: theme.size.m,
    rowGap: theme.size.xs,
    marginTop: theme.size.xs,
    marginBottom: theme.size.s,
  });

  const dividerStyle = css({
    width: 1,
    height: theme.base,
    background: theme.colors.borderBaseSubdued,
  });

  // Icon and value on one line; minWidth 0 lets a long value shrink (and truncate) inside the line
  const infoItemStyle = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  });

  return {
    infoLineStyle,
    dividerStyle,
    infoItemStyle,
  };
};
