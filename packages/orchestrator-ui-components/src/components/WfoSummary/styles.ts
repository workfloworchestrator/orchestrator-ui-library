import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getWfoSummaryCardsStyles = (theme: EuiThemeComputed) => {
    const cardContainerStyle = css({
        height: theme.base * 36,
        minWidth: theme.base * 25,
    });

    return {
        cardContainerStyle,
    };
};
