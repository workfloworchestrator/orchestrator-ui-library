import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const textAnchorStyle = css({
        marginTop: theme.size.xxs,
        marginLeft: 0,
        fontSize: theme.size.m,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.link,
        cursor: 'pointer',
    });

    return {
        textAnchorStyle,
    };
};
