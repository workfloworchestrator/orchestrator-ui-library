import { css } from '@emotion/react';

export const getStyles = () => {
    const sortButtonsContainerStyle = css({
        display: 'flex',
        alignItems: 'center',
    });

    const getSortButtonStyle = (isActive: boolean) =>
        css({
            display: 'flex',
            alignItems: 'center',
            cursor: isActive ? 'pointer' : 'not-allowed',
        });

    return {
        sortButtonsContainerStyle,
        getSortButtonStyle,
    };
};
