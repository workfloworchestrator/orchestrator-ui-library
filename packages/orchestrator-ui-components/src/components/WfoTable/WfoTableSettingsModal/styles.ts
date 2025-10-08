import { css } from '@emotion/react';

import { WfoTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export const getWfoTableSettingsModalStyles = (wfoTheme: WfoTheme) => {
    const { formFieldBaseStyle } = getFormFieldsBaseStyle(wfoTheme);

    const { theme } = wfoTheme;

    const formRowStyle = css({
        justifyContent: 'space-between',
        '.euiFormLabel': {
            color: theme.colors.text,
        },
    });

    return {
        formRowStyle,
        selectFieldStyle: formFieldBaseStyle,
    };
};
