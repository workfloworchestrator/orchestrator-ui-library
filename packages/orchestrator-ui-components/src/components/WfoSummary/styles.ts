import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoSummaryCardsStyles = ({ theme }: WfoThemeHelpers) => {
    const cardContainerStyle = css({
        height: theme.base * 36,
        minWidth: theme.base * 25,
    });

    return {
        cardContainerStyle,
    };
};
