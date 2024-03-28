import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getCopyrightStyles = (theme: EuiThemeComputed) => {
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

export const getMenuItemStyles = (theme: EuiThemeComputed) => {
    const menuItemStyle = css({
        color: theme.colors.title,
        padding: `${theme.base * 0.625}px ${theme.base * 0.75}px`,
        display: 'flex',
        alignItems: 'center',
        ':hover': {
            textDecoration: 'underline',
        },
    });

    const selectedMenuItem = css({
        height: `${theme.base * 2.25}px`,
        backgroundColor: theme.colors.lightShade,
        borderRadius: theme.border.radius.medium,
        padding: `${theme.base * 0.5}px ${theme.base * 0.75}px`,
        display: 'flex',
        alignItems: 'center',
        fontWeight: theme.font.weight.semiBold,
    });

    return {
        menuItemStyle,
        selectedMenuItem,
    };
};
