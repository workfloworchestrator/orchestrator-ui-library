import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';

export const getStyles = (theme: EuiThemeComputed) => {
    const uuidFieldStyle = css({
        fontWeight: theme.font.weight.medium,
    });

    return {
        uuidFieldStyle,
    };
};
