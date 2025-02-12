import { CSSObject, css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getCopyrightStyles = ({ theme }: WfoTheme) => {
    const copyrightStyle = css({
        position: 'fixed',
        bottom: 0,
        left: 0,
        padding: 10,
        fontSize: theme.size.s,
        color: theme.colors.primaryText,
    });

    return {
        copyrightStyle,
    };
};

export const getMenuStyles = ({ theme }: WfoTheme) => {
    const menuStyle = css({
        '.euiSideNavItem--branch': {
            '&:after': {
                backgroundColor: theme.colors.lightShade,
                height: '120%',
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

export const getMenuItemStyles = ({ theme, isDarkThemeActive }: WfoTheme) => {
    const baseStyles: CSSObject = {
        lineHeight: `${theme.base * 1.25}px`,
        display: 'flex',
        alignItems: 'center',
        ':hover': {
            textDecoration: 'underline',
        },
        color: theme.colors.subduedText,
        padding: `${theme.base * 0.5}px ${theme.base * 0.75}px`,
    };

    const baseSubMenuStyles: CSSObject = {
        ...baseStyles,
        ':after': {
            content: "''",
            top: '16px',
            left: 0,
            width: '4px',
            height: '1px',
            backgroundColor: theme.colors.lightShade,
            position: 'absolute',
        },
        ':last-child': {
            ':after': {
                top: '18px',
            },
        },
    };

    const menuItemStyle = css({
        ...baseStyles,
    });

    const selectedMenuItemBaseStyle = {
        ...baseStyles,
        height: `${theme.base * 2.25}px`,
        backgroundColor: isDarkThemeActive
            ? theme.colors.mediumShade
            : theme.colors.header,
        borderRadius: theme.border.radius.medium,
        color: theme.colors.ghost,
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
        backgroundColor: isDarkThemeActive
            ? theme.colors.mediumShade
            : theme.colors.header,
        borderRadius: theme.border.radius.medium,
        color: theme.colors.ghost,
        marginLeft: `${theme.size.xs}`,
        paddingLeft: `${theme.size.s}`,
    });

    const subMenuHeaderStyle = css({
        ...baseStyles,
        color: theme.colors.text,
    });
    return {
        menuItemStyle,
        selectedMenuItem,
        selectedSubMenuItem,
        subMenuItemStyle,
        subMenuHeaderStyle,
    };
};
