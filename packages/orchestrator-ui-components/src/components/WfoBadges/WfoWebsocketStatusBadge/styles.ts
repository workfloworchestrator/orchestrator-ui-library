import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
    const connectedStyle = css({
        paddingLeft: theme.base / 2,
        cursor: 'default',
        backgroundColor: theme.colors.ghost,
    });

    const disconnectedStyle = css({
        paddingLeft: theme.base / 2,
        cursor: 'pointer',
        backgroundColor: theme.colors.danger,
    });

    return {
        connectedStyle,
        disconnectedStyle,
    };
};
