import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const COPY_ICON_CLASS = 'copyIcon';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const uuidFieldStyle = css({
    fontWeight: theme.font.weight.medium,
    display: 'flex',
    gap: theme.size.xs,
    [`&:focus-visible .${COPY_ICON_CLASS}`]: {
      visibility: 'visible',
    },
    [`&:hover .${COPY_ICON_CLASS}`]: {
      visibility: 'visible',
    },
  });

  const clickable = css({
    cursor: 'pointer',
    visibility: 'hidden',
  });

  return {
    clickable,
    uuidFieldStyle,
  };
};
