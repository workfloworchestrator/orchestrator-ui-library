import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const selectableStyle = css({
        '.euiFieldSearch': {
            backgroundColor: theme.colors.body,
            color: theme.colors.text,
            '&:focus': {
                backgroundColor: theme.colors.emptyShade,
            },
        },

        '.euiSelectableList .euiSelectableListItem': {
            borderColor: theme.colors.lightShade,
        },
    });

    return {
        selectableStyle,
    };
};
