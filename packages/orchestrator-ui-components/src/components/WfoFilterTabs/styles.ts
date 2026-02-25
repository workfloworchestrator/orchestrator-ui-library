import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const tabStyle = css({
    gap: `${theme.size.xxs}`,
    '.euiTab__prepend': {
      marginRight: `${theme.size.xs}`,
    },
  });

  return { tabStyle };
};
