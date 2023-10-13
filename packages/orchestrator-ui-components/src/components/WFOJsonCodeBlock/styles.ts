import { css } from '@emotion/react';
import { EuiThemeComputed } from '@elastic/eui';

export const getStyles = (theme: EuiThemeComputed) => {
    const euiCodeBlockStyle = css({
        marginTop: 10,
        borderRadius: theme.border.radius.medium,
    });

    return {
        euiCodeBlockStyle,
    };
};
