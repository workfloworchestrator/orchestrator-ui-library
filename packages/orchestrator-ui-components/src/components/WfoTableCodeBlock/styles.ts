import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const tableCodeBlockMarginStyle = css({
        margin: 10,
        borderRadius: theme.border.radius.medium,
        border: `thin solid ${theme.colors.lightestShade}`,
    });

    return {
        tableCodeBlockMarginStyle,
    };
};
