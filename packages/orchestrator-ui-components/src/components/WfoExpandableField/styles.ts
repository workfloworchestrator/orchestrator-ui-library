import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const titleRowStyle = css({
        display: 'flex',
        alignItems: 'center',
    });

    const titleStyle = css({
        marginLeft: theme.size.s,
    });

    return {
        titleRowStyle,
        titleStyle,
    };
};
