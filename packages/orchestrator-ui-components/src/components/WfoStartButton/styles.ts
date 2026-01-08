import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const selectableStyle = css({
        '.euiFieldSearch': {
            backgroundColor: theme.colors.backgroundBasePlain,
            color: theme.colors.textParagraph,
            '&:focus': {
                backgroundColor: theme.colors.backgroundBaseNeutral,
            },
        },

        '.euiSelectableList .euiSelectableListItem': {
            borderColor: theme.colors.borderBaseSubdued,
        },
    });

    return {
        selectableStyle,
    };
};
