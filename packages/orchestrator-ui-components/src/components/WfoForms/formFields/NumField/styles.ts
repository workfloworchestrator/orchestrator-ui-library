import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export const getNumFieldStyles = (wfoTheme: WfoTheme) => {
    const { theme } = wfoTheme;
    const { formFieldBaseStyle } = getFormFieldsBaseStyle(wfoTheme);

    const formRowStyle = css({
        '.euiFormLabel, .euiText': {
            color: theme.colors.text,
        },
    });

    return {
        formRowStyle,
        numFieldStyle: formFieldBaseStyle,
    };
};
