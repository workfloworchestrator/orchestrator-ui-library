import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getCommonFormFieldStyles = ({ theme }: WfoTheme) => {
    const formRowStyle = css({
        '.euiText': {
            color: theme.colors.text,
        },
        '.euiFormLabel': {
            color: theme.colors.text,
            '&.euiFormLabel-isFocused': {
                color: theme.colors.primaryText,
            },
        },
    });

    return {
        formRowStyle,
    };
};
