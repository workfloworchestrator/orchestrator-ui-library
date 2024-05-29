import { css } from '@emotion/react';

import type { WfoTheme } from '@/hooks';

export const getStyles = (wfoTheme: WfoTheme) => {
    const { theme, toSecondaryColor } = wfoTheme;
    const iconStyle = css({
        width: 45,
        height: 45,
        backgroundColor: toSecondaryColor(theme.colors.primary),
        paddingTop: 13,
        paddingLeft: 15,
        borderRadius: 7,
    });

    const panelStyle = css({
        backgroundColor: theme.colors.lightestShade,
    });

    const panelStyleOutsideCurrentSubscription = css({
        backgroundColor: toSecondaryColor(theme.colors.lightestShade),
        border: `dashed 1px ${theme.colors.lightShade}`,
    });

    const rowStyle = css({
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
        '&:first-child': {
            borderTop: `solid 1px ${theme.colors.lightShade}`,
        },
    });

    const leftColumnStyle = css({
        verticalAlign: 'top',
        width: 250,
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
    });

    const rightColumnStyle = css({
        verticalAlign: 'top',
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
    });

    return {
        iconStyle,
        panelStyle,
        leftColumnStyle,
        rightColumnStyle,
        rowStyle,
        panelStyleOutsideCurrentSubscription,
    };
};
