import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const uuidFieldStyle = css({
        fontWeight: theme.font.weight.medium,
    });

    return {
        uuidFieldStyle,
    };
};
