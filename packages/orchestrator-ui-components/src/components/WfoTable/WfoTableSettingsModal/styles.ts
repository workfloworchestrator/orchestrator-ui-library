import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export const getWfoTableSettingsModalStyles = (
    useOrchestratorThemeProps: UseOrchestratorThemeProps,
) => {
    const { formFieldBaseStyle } = getFormFieldsBaseStyle(
        useOrchestratorThemeProps,
    );

    const formRowStyle = css({
        justifyContent: 'space-between',
        '.euiFormLabel': {
            color: useOrchestratorThemeProps.theme.colors.textParagraph,
        },
    });

    return {
        formRowStyle,
        selectFieldStyle: formFieldBaseStyle,
    };
};
