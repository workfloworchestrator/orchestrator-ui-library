import { css } from '@emotion/react';

export const getWfoLogoSpinnerStyles = () => {
    const spinCenteringCss = css({
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    const spinContainerCss = css({
        display: 'flex',
        alignItems: 'center',
        width: '80px',
        height: '80px',
        margin: '0 auto',
        justifyContent: 'center',
        backgroundColor: '#04385F',
        borderRadius: '8px',
    });

    const spinPathCss = css({
        transformBox:
            'fill-box' /* makes transform relative to the path itself */,
        transformOrigin: 'center',
        animation: 'spin 3s linear infinite',
        '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
        },
    });

    return {
        spinContainerCss,
        spinCenteringCss,
        spinPathCss,
    };
};
