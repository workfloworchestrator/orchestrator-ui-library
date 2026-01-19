import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
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
