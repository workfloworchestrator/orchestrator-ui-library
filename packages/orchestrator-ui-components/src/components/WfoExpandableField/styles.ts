import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const titleRowStyle = css({
        display: 'flex',
        alignItems: 'center',
    });

    const titleStyle = css({
        marginLeft: theme.size.s,
    });

    return {
        titleRowStyle,
        titleStyle,
    };
};
