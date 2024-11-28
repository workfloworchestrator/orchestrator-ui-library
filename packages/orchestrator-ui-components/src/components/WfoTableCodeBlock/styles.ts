import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const tableCodeBlockMarginStyle = css({
        margin: theme.size.base,
        marginTop: theme.size.l,
        marginRight: theme.size.l,
    });

    return {
        tableCodeBlockMarginStyle,
    };
};
