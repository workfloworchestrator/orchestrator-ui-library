import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getFormFieldsBaseStyle = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const formFieldBaseStyle = css({
        backgroundColor: theme.colors.body,
        color: theme.colors.text,
        '&:focus': {
            backgroundColor: theme.colors.emptyShade,
        },
    });

    return {
        formFieldBaseStyle,
    };
};
