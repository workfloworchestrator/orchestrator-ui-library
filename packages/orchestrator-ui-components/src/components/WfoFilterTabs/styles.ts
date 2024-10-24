import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const tabStyle = css({
        gap: `${theme.size.xxs}`,
        '.euiTab__prepend': {
            marginRight: `${theme.size.xs}`,
        },
    });

    return { tabStyle };
};
