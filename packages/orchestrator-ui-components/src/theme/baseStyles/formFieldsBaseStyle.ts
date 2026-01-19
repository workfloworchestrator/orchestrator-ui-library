import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getFormFieldsBaseStyle = ({ theme }: WfoThemeHelpers) => {
    const formFieldBaseStyle = css({
        backgroundColor: theme.colors.backgroundBaseSubdued,
        color: theme.colors.textParagraph,
        '&:focus, &:focus-visible, &:focus-within': {
            backgroundColor: theme.colors.backgroundBaseNeutral,
            boxShadow: `0 0 0 1px ${theme.colors.primary}`,
        },
        // boxShadow: `0 0 0 1px ${theme.colors.borderBaseSubdued} !important`,
    });

    return {
        formFieldBaseStyle,
    };
};
