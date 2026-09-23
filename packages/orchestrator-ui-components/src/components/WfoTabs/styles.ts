import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

/*
 * EUI 122 restyled EuiTab: unselected tabs use `textSubdued` instead of `textHeading`, the
 * selected tab uses `textHeading` instead of `textPrimary`, horizontal padding dropped from
 * `size.xs` to 0 and the label weight dropped from the title weight to semiBold. None of that is
 * themeable through tokens, so these styles restore the pre-122 appearance.
 *
 * They are applied to a wrapper element around EuiTabs rather than to EuiTabs itself: EuiTabs
 * renders `<div css={ownStyles} {...rest}>`, so a `css` prop passed to it replaces EUI's own
 * styles instead of merging with them, which drops `display: flex`, the size `gap`,
 * `position: relative` (the selected tab underline is absolutely positioned against it),
 * the overflow handling and `flex-shrink: 0`.
 */
export const getWfoTabsStyles = ({ theme }: WfoThemeHelpers) => {
  const tabsWrapperStyle = css({
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

  return { tabsWrapperStyle };
};
