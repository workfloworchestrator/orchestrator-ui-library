import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const euiCodeBlockStyle = css({
        marginTop: 10,
        borderRadius: theme.border.radius.medium,
    });

    return {
        euiCodeBlockStyle,
    };
};
