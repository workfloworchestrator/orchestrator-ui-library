import { css } from '@emotion/react';

export const getTasksBadgeStyles = () => {
    const failedTaskBadgeStyle = css({
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
    });

    return { failedTaskBadgeStyle };
};
