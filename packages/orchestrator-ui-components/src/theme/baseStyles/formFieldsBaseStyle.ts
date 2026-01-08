import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getFormFieldsBaseStyle = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const formFieldBaseStyle = css({
        backgroundColor: theme.colors.backgroundBasePlain,
        color: theme.colors.textParagraph,
        '&:focus': {
            backgroundColor: theme.colors.backgroundBaseNeutral,
        },
    });

    return {
        formFieldBaseStyle,
    };
};
