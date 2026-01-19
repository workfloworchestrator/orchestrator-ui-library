import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
    const tableCodeBlockMarginStyle = css({
        margin: theme.size.base,
        marginTop: theme.size.l,
        marginRight: theme.size.l,
    });

    return {
        tableCodeBlockMarginStyle,
    };
};
