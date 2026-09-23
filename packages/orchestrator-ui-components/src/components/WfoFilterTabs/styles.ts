import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const tabStyle = css({
    gap: `${theme.size.xxs}`,
    '.euiTab__prepend': {
      marginRight: `${theme.size.xs}`,
    },
  });

  /*
   * EUI 122 restyled EuiTab: unselected tabs use `textSubdued` instead of `textHeading`, the
   * selected tab uses `textHeading` instead of `textPrimary`, horizontal padding dropped from
   * `size.xs` to 0 and the label weight dropped from the title weight to semiBold. None of that is
   * themeable through tokens, so this restores the pre-122 appearance. Apply it to the EuiTabs
   * wrapper so every EuiTab inside it is covered.
   */
  const tabsStyle = css({
    '.euiTab': {
      paddingInline: theme.size.xs,
      color: theme.colors.textHeading,
    },
    '.euiTab-isSelected': {
      color: theme.colors.textPrimary,
    },
    '.euiTab__content': {
      fontWeight: theme.font.weight[theme.font.title.weight],
    },
    '.euiTab:disabled': {
      color: theme.colors.textDisabled,
    },
  });

  return { tabStyle, tabsStyle };
};
