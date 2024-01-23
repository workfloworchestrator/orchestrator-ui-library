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
