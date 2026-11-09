import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoPageHeaderStyles = ({ theme }: WfoThemeHelpers) => {
  // Replaces the removed EuiHeaderLogo `iconType` rendering: EuiHeaderLogo now
  // always renders the Elastic logo, so the app logo is rendered directly.
  // Mirrors the old EuiHeaderLogo anchor box: a fixed height/min-width of
  // theme.size.xxl that the intrinsically 64x64 WfoAppLogo overflows without
  // affecting the surrounding header layout.
  const appLogoStyle = css({
    position: 'relative',
    height: theme.size.xxl,
    minWidth: theme.size.xxl,
    paddingInline: theme.size.s,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const appNameStyle = css({
    paddingRight: theme.base,
    marginRight: theme.base,
    borderRight: `${theme.border.width.thick} solid ${theme.colors.textSubdued}`,
  });

  const getHeaderStyle = (navigationHeight: number) => {
    return css({
      backgroundColor: theme.colors.header,
      height: navigationHeight,
      borderBottom: theme.colors.header, // Overrides EuiHeader default border bottom
    });
  };

  return {
    appLogoStyle,
    appNameStyle,
    getHeaderStyle,
  };
};
