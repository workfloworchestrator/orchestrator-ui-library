import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getWfoSummaryCardsStyles = ({ theme }: WfoTheme) => {
    const cardContainerStyle = css({
        height: theme.base * 36,
        minWidth: theme.base * 25,
    });

    return {
        cardContainerStyle,
    };
};
