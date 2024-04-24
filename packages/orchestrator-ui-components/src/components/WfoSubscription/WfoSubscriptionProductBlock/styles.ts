import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme, toSecondaryColor }: WfoTheme) => {
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

    const panelStyleOutsideSubscriptionBoundary = css({
        backgroundColor: toSecondaryColor(theme.colors.lightestShade),
        border: `dashed 1px ${theme.colors.lightShade}`,
    });

    const rowStyle = css({
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
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    });

    const rightColumnStyle = css({
        verticalAlign: 'top',
        paddingLeft: 0,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
    });

    return {
        iconStyle,
        panelStyle,
        leftColumnStyle,
        rightColumnStyle,
        rowStyle,
        panelStyleOutsideSubscriptionBoundary,
    };
};
