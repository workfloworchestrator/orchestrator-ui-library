import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const codeBlockStyle = css({
        marginTop: theme.size.m,
        marginBottom: theme.size.l,
        borderRadius: theme.border.radius.medium,
    });

    return {
        codeBlockStyle,
    };
};
