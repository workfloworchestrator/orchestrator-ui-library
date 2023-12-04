import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const textAnchorStyle = css({
        marginTop: 2,
        marginLeft: 0,
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.link,
        cursor: 'pointer',
    });

    return {
        textAnchorStyle,
    };
};
