import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

import { toHexColorWithOpacity } from './utils/toHexColorWithOpacity';

export const getWfoPageHeaderStyles = ({ theme }: WfoTheme) => {
    const navigationBackgroundColor = '#04385F';

    const appNameStyle = css({
        paddingRight: theme.base,
        marginRight: theme.base,
        borderRight: `${theme.border.width.thick} solid ${toHexColorWithOpacity(
            theme.colors.emptyShade,
            0.3,
        )}`,
    });

    const getHeaderStyle = (navigationHeight: number) => {
        return css({
            backgroundColor: navigationBackgroundColor,
            height: navigationHeight,
        });
    };

    return {
        appNameStyle,
        getHeaderStyle,
    };
};
