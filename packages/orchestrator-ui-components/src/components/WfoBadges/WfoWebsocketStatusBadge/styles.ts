import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme, isDarkModeActive }: WfoThemeHelpers) => {
    const connectedStyle = css({
        paddingLeft: theme.base / 2,
        cursor: 'default',
        backgroundColor: isDarkModeActive
            ? theme.colors.backgroundBaseNeutral
            : theme.colors.textGhost,
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
