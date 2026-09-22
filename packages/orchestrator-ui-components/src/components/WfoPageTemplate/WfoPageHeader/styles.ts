import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoPageHeaderStyles = ({ theme }: WfoThemeHelpers) => {
  // Replaces the removed EuiHeaderLogo `iconType` rendering: EuiHeaderLogo now
  // always renders the Elastic logo, so the app logo is rendered directly.
  const appLogoStyle = css({
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: theme.size.s,
    svg: {
      width: theme.size.l,
      height: theme.size.l,
    },
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
