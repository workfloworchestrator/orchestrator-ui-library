import { CSSObject, css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getCopyrightStyles = ({ theme }: WfoThemeHelpers) => {
  const copyrightStyle = css({
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: 10,
    fontSize: theme.size.s,
    color: theme.colors.textPrimary,
  });

  return {
    copyrightStyle,
  };
};

export const getMenuStyles = ({ theme }: WfoThemeHelpers) => {
  const menuStyle = css({
    backgroundColor: theme.colors.backgroundBaseSubdued,
    '.euiSideNavItem--trunk > .euiSideNavItem__items': {
      marginInline: theme.base,
    },
    '.euiSideNavItem--branch': {
      '&:after': {
        backgroundColor: theme.colors.borderBaseSubdued,
        height: '100%',
      },
      ':last-child': {
        '&:after': {
          height: '50%',
        },
      },
    },
  });
  return {
    menuStyle,
  };
};

export const getMenuItemStyles = ({ theme, isDarkModeActive }: WfoThemeHelpers) => {
  const baseStyles: CSSObject = {
    lineHeight: `${theme.base * 1.25}px`,
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      textDecoration: 'underline',
    },
    color: theme.colors.textSubdued,
    padding: `${theme.base * 0.5}px ${theme.base * 0.75}px`,
  };

  const subItemDash: CSSObject = {
    ':after': {
      content: "''",
      top: '50%',
      left: 0,
      width: '4px',
      height: '1px',
      backgroundColor: theme.colors.borderBaseSubdued,
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  };

  const baseSubMenuStyles: CSSObject = {
    ...baseStyles,
    ...subItemDash,
  };

  const menuItemStyle = css({
    ...baseStyles,
  });

  const selectedMenuItemBaseStyle = {
    ...baseStyles,
    height: `${theme.base * 2.25}px`,
    backgroundColor: isDarkModeActive ? theme.colors.header : theme.colors.backgroundLightPrimary,
    borderRadius: theme.border.radius.medium,
    color: isDarkModeActive ? theme.colors.textGhost : theme.colors.textPrimary,
    fontWeight: theme.font.weight.medium,
  };

  const selectedMenuItem = css({
    ...selectedMenuItemBaseStyle,
  });

  const subMenuItemStyle = css({
    ...baseSubMenuStyles,
    marginLeft: `${theme.size.xs}`,
    paddingLeft: `${theme.size.s}`,
  });

  const selectedSubMenuItem = css({
    ...baseSubMenuStyles,
    height: `${theme.base * 2.25}px`,
    backgroundColor: isDarkModeActive ? theme.colors.header : theme.colors.backgroundLightPrimary,
    borderRadius: theme.border.radius.medium,
    color: isDarkModeActive ? theme.colors.textGhost : theme.colors.textPrimary,
    fontWeight: theme.font.weight.medium,
    marginLeft: `${theme.size.xs}`,
    paddingLeft: `${theme.size.s}`,
  });

  const subMenuHeader: CSSObject = {
    ...baseStyles,
    color: theme.colors.link,
    fontWeight: theme.font.weight.medium,
  };
  const subMenuHeaderStyle = css({
    ...subMenuHeader,
  });

  const subMenuSubItemHeaderStyle = css({
    ...subMenuHeader,
    ...{
      ':after': {
        content: "''",
        left: 0,
        width: '4px',
        height: '1px',
        backgroundColor: theme.colors.borderBaseSubdued,
        position: 'absolute',
      },
    },
  });
  return {
    menuItemStyle,
    selectedMenuItem,
    selectedSubMenuItem,
    subMenuItemStyle,
    subMenuHeaderStyle,
    subMenuSubItemHeaderStyle,
  };
};
