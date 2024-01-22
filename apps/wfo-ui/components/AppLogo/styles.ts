import { css } from '@emotion/css';

export const getAppLogoStyles = () => {
    const logoStyle = css({
        display: 'flex',
        flexDirection: 'column',
    });

    return { logoStyle };
};
