import { EuiThemeComputed } from '@elastic/eui';
import { css } from '@emotion/react';

export const getWfoSummaryCardHeaderStyles = (theme: EuiThemeComputed) => {
    // Header
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
