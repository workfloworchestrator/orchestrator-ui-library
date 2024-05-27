import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
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
