import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoSummaryCardHeaderStyles = ({ theme }: WfoThemeHelpers) => {
    const avatarStyle = css({
        maxHeight: theme.base * 3,
        maxWidth: theme.base * 3,
    });

    const totalSectionStyle = css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    });

    const valueStyle = css({
        fontSize: theme.size.l,
        fontWeight: theme.font.weight.semiBold,
    });

    return {
        avatarStyle,
        totalSectionStyle,
        valueStyle,
    };
};
