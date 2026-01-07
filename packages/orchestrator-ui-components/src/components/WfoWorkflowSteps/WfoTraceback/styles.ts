import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const codeBlockStyle = css({
        marginTop: theme.size.m,
        marginBottom: theme.size.l,
        borderRadius: theme.border.radius.medium,
    });

    return {
        codeBlockStyle,
    };
};
