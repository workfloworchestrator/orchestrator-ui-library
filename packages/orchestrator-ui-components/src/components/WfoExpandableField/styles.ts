import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const titleRowStyle = css({
        display: 'flex',
        alignItems: 'center',
    });

    const titleStyle = css({
        marginLeft: theme.size.s,
    });

    return {
        titleRowStyle,
        titleStyle,
    };
};
