import { css } from '@emotion/react';

import { WfoComputedTheme } from '@/theme';

export const getWfoArrayFieldStyles = (theme: WfoComputedTheme) => {
    const container = css({
        border: 'thin solid ' + theme.colors.borderBaseSubdued,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    });

    const fieldWrapper = css({
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    });

    const minusButton = css({
        width: '40px',
        cursor: 'pointer',
        marginBottom: '12px',
    });

    const plusButtonWrapper = css({
        display: 'flex',
        cursor: 'pointer',
        justifyContent: 'end',
    });

    return {
        container,
        fieldWrapper,
        minusButton,
        plusButtonWrapper,
    };
};
