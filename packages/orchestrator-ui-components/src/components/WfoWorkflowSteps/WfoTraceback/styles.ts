import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const codeBlockStyle = css({
    marginTop: theme.size.m,
    marginBottom: theme.size.l,
    borderRadius: theme.border.radius.medium,
  });

  return {
    codeBlockStyle,
  };
};
