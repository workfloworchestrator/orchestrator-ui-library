import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const titleRowStyle = css({
    display: 'flex',
    alignItems: 'center',
  });

  const titleStyle = css({
    marginLeft: theme.size.s,
  });

  return {
    titleRowStyle,
    titleStyle,
  };
};
