import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { css } from '@emotion/react';
import { makeHighContrastColor } from '@elastic/eui';

export const getStyles = (theme: EuiThemeComputed) => {
    const getStepNumberStyle = (backgroundColor: string, textColor: string) =>
        css({
            '.euiStepNumber': {
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                color: makeHighContrastColor(textColor)(backgroundColor),
            },
        });

    const timelinePanelStyle = css({
        backgroundColor: theme.colors.body,
        borderRadius: theme.border.radius.medium,
        overflow: 'auto',
        scrollbarWidth: 'auto',
    });

    const stepCompleteStyle = getStepNumberStyle(
        theme.colors.primary,
        theme.colors.primaryText,
    );

    const stepWarningStyle = getStepNumberStyle(
        theme.colors.warning,
        theme.colors.warningText,
    );

    const stepErrorStyle = getStepNumberStyle(
        theme.colors.danger,
        theme.colors.dangerText,
    );

    const stepIncompleteStyle = css({
        '.euiStepNumber__number': {
            display: 'none',
        },
    });

    const stepHideIconStyle = css({
        '.euiIcon': {
            display: 'none',
        },
    });

    return {
        timelinePanelStyle,
        stepCompleteStyle,
        stepWarningStyle,
        stepErrorStyle,
        stepIncompleteStyle,
        stepHideIconStyle,
    };
};
