import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const tabStyle = css({
        '.euiTab__append': {
            marginLeft: `-${theme.size.xs}`,
        },
    });

    return { tabStyle };
};
