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
            },
        },
    });

    return {
        menuStyle,
    };
};

export const getMenuItemStyles = ({ theme }: WfoTheme) => {
    const baseStyles: CSSObject = {
        lineHeight: `${theme.base * 1.25}px`,
        display: 'flex',
        alignItems: 'center',
        ':hover': {
            textDecoration: 'underline',
        },
        color: theme.colors.text,
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
        padding: '8px 12px',
        ':last-child': {
            top: '-4px',
            position: 'relative',
        },
    };

    const menuItemStyle = css({
        ...baseStyles,
        color: theme.colors.subduedText,
    });

    const selectedMenuItem = css({
        ...baseStyles,
        height: `${theme.base * 2.25}px`,
        backgroundColor: theme.colors.lightShade,
        borderRadius: theme.border.radius.medium,
        fontWeight: theme.font.weight.semiBold,
        color: theme.colors.darkestShade,
    });

    const selectedSubMenuItem = css({
        ...baseSubMenuStyles,
        fontWeight: theme.font.weight.medium,
        color: theme.colors.darkestShade,
    });

    const subMenuItemStyle = css({
        ...baseSubMenuStyles,
    });

    return {
        menuItemStyle,
        selectedMenuItem,
        selectedSubMenuItem,
        subMenuItemStyle,
    };
};
