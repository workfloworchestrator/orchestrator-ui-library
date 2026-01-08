import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const monacoEditorStyle = css({
        marginTop: 10,
        padding: 10,
        backgroundColor: theme.colors.backgroundBasePlain,
        borderRadius: theme.border.radius.medium,
    });

    return {
        monacoEditorStyle,
    };
};
