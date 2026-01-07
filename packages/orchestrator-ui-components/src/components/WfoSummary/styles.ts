import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getWfoSummaryCardsStyles = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const cardContainerStyle = css({
        height: theme.base * 36,
        minWidth: theme.base * 25,
    });

    return {
        cardContainerStyle,
    };
};
