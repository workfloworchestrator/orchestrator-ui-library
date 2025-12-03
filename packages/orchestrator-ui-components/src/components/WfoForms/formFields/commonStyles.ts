import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';

export const getCommonFormFieldStyles = ({ theme }: WfoTheme) => {
    const formRowStyle = css({
        marginBottom: theme.base * 2,

        '.euiText': {
            color: theme.colors.text,
        },
        '.euiFormLabel': {
            color: theme.colors.text,
            cursor: 'text',
            '&.euiFormLabel-isFocused': {
                color: theme.colors.primaryText,
            },
        },
        '.euiFormRow__labelWrapper': {
            display: 'flex',
            flexDirection: 'column',
        },
    });

    const errorStyle = css({
        color: theme.colors.dangerText,
    });
    return {
        errorStyle,
        formRowStyle,
    };
};
