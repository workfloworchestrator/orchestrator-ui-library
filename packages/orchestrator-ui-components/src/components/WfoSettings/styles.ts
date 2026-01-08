import { css } from '@emotion/react';

import { UseOrchestratorThemeProps } from '@/hooks';

export const getWfoFlushSettingsStyle = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const comboboxStyle = css({
        // .euiComboBox is needed to override eui styling (more specific)
        '&.euiComboBox': {
            '.euiComboBox__inputWrap': {
                border: `1px solid ${theme.colors.borderBaseSubdued}`,
                boxShadow: 'none',
                backgroundColor: theme.colors.body,
            },
            '&.euiComboBox-isOpen': {
                '.euiComboBox__inputWrap': {
                    backgroundColor: theme.colors.backgroundBaseNeutral,
                },
            },
        },
    });

    return {
        comboboxStyle,
    };
};
