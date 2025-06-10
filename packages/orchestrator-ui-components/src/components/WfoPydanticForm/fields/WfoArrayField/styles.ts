import { css } from '@emotion/react';

export const getWfoArrayFieldStyles = () => {
    const container = css({
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
