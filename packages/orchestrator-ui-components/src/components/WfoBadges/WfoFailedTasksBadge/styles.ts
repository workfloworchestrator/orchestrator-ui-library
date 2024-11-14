import { css } from '@emotion/react';

export const getTasksBadgeStyles = () => {
    const taskBadgeStyle = css({
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
    });

    return { taskBadgeStyle };
};
