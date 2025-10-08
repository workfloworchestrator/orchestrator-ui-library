import { shade, tint } from '@elastic/eui';
import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getWfoDiffStyles = ({
    theme,
    toSecondaryColor,
    isDarkThemeActive,
}: WfoTheme) => {
    const SHADE_FACTOR = 0.5;
    const TINT_FACTOR = 0.65;

    const insertGutterColor = toSecondaryColor(theme.colors.success);
    const insertCodeColor = isDarkThemeActive
        ? shade(insertGutterColor, SHADE_FACTOR)
        : tint(insertGutterColor, TINT_FACTOR);

    const deleteColor = toSecondaryColor(theme.colors.danger);
    const deleteSecondaryColor = isDarkThemeActive
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
            color: theme.colors.text,
        },
    });

    return {
        diffStyle,
    };
};
