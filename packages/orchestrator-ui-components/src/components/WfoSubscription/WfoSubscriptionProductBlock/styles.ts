import { css } from '@emotion/react';

import type { WfoTheme } from '@/hooks';

export const getStyles = (wfoTheme: WfoTheme) => {
    const { theme, toSecondaryColor } = wfoTheme;
    const iconStyle = css({
        width: 45,
        height: 45,
        backgroundColor: toSecondaryColor(theme.colors.primary),
        color: theme.colors.primary,
        paddingTop: 13,
        paddingLeft: 15,
        borderRadius: 7,
    });

    const iconOutsideCurrentSubscriptionStyle = css([
        iconStyle,
        {
            backgroundColor: theme.colors.lightShade,
            color: theme.colors.darkestShade,
        },
    ]);

    const panelStyle = css({
        backgroundColor: toSecondaryColor(
            toSecondaryColor(theme.colors.primary),
        ),
        border: `solid 1px ${toSecondaryColor(theme.colors.primary)}`,
    });

    const panelStyleOutsideCurrentSubscription = css({
        backgroundColor: toSecondaryColor(theme.colors.emptyShade),
        border: `dashed 1px ${theme.colors.lightShade}`,
    });

    const rowStyle = css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: `${theme.base / 2}px 0`,
        borderBottom: `solid 1px ${theme.colors.lightShade}`,
        '&:first-child': {
            borderTop: `solid 1px ${theme.colors.lightShade}`,
        },
        '&:last-child': {
            borderBottom: 'none',
        },
    });

    const leftColumnStyle = css({
        width: 250,
        flexShrink: 0,
        paddingTop: `${theme.base / 4}px`,
    });

    const leftColumnStyleWithAlignSelf = css({
        width: 250,
        flexShrink: 0,
        alignSelf: 'center',
    });

    const outsideSubscriptionIdTextStyle = css({
        padding: `${theme.size.xs}px 0`,
    });

    return {
        iconStyle,
        iconOutsideCurrentSubscriptionStyle,
        panelStyle,
        leftColumnStyle,
        leftColumnStyleWithAlignSelf,
        rowStyle,
        panelStyleOutsideCurrentSubscription,
        outsideSubscriptionIdTextStyle,
    };
};
