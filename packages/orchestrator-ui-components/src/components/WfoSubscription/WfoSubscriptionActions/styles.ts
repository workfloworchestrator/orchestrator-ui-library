import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

const EXPANDED_CONTENT_LEFT_MARGIN = '52px';

export const getSubscriptionActionStyles = ({ theme }: WfoThemeHelpers) => {
  const clickableStyle = css({
    '&:hover, & :hover': {
      cursor: 'pointer',
    },
  });

  const expandableMenuItemStyle = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const expandButtonStyle = css({
    marginRight: theme.size.m,
  });

  const expandedContentStyle = css({
    marginLeft: EXPANDED_CONTENT_LEFT_MARGIN,
    paddingBottom: theme.size.m,
    paddingRight: theme.size.m,
  });

  const linkStyle = css({
    display: 'block',
  });

  const linkMenuItemStyle = css({
    '&>:hover': {
      backgroundColor: theme.colors.backgroundBasePlain,
      borderRadius: theme.border.radius.medium,
      cursor: 'pointer',
    },
    '.euiToolTipAnchor': {
      width: '100%',
    },
  });

  const tooltipMenuItemStyle = css([
    linkMenuItemStyle,
    {
      '& > *': {
        display: 'block',
      },
    },
  ]);

  const disabledIconStyle = css({
    display: 'flex',
    width: theme.base * 2,
  });

  const iconStyle = css({
    width: theme.base * 2,
  });

  const secondaryIconStyle = css({
    position: 'absolute',
    transform: 'translate(13px, -8px);',
  });

  const spinnerSecondaryIconStyle = css({
    transform: 'translate(-8px, -6px);',
  });

  const disabledTextStyle = css({
    color: theme.colors.textDisabled,
  });

  const contextMenuItemStyle = css({
    whiteSpace: 'nowrap',
    // EUI 122 renders EuiContextMenuItem through EuiListItemLayout, which sets its own
    // horizontal padding (size.s) and gap. EUI 113 applied `padding: size.m` on all sides.
    // Only restore the vertical padding; overriding the horizontal padding or the gap
    // would double up on what the layout already provides.
    paddingBlock: theme.size.s,
  });

  return {
    clickableStyle,
    contextMenuItemStyle,
    expandableMenuItemStyle,
    expandButtonStyle,
    expandedContentStyle,
    linkStyle,
    linkMenuItemStyle,
    tooltipMenuItemStyle,
    disabledIconStyle,
    iconStyle,
    secondaryIconStyle,
    disabledTextStyle,
    spinnerSecondaryIconStyle,
  };
};
