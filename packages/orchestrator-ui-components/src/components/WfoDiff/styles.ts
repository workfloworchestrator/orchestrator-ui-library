import { shade, tint } from '@elastic/eui';
import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getWfoDiffStyles = ({
    theme,
    toSecondaryColor,
    isDarkModeActive,
}: UseOrchestratorThemeProps) => {
    const SHADE_FACTOR = 0.5;
    const TINT_FACTOR = 0.65;

    const insertGutterColor = toSecondaryColor(theme.colors.success);
    const insertCodeColor = isDarkModeActive
        ? shade(insertGutterColor, SHADE_FACTOR)
        : tint(insertGutterColor, TINT_FACTOR);

    const deleteColor = toSecondaryColor(theme.colors.danger);
    const deleteSecondaryColor = isDarkModeActive
        ? shade(deleteColor, SHADE_FACTOR)
        : tint(deleteColor, TINT_FACTOR);

    const diffStyle = css({
        '.diff-code-insert': {
            backgroundColor: insertCodeColor,
        },
        '.diff-gutter-insert': {
            backgroundColor: insertGutterColor,
        },
        '.diff-code-delete': {
            backgroundColor: deleteSecondaryColor,
        },
        '.diff-gutter-delete': {
            backgroundColor: deleteColor,
        },

        '.operator, .punctuation': {
            color: theme.colors.textParagraph,
        },
    });

    return {
        diffStyle,
    };
};
