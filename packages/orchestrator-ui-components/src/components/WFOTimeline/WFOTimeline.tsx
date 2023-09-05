import { useOrchestratorTheme } from '../../hooks';
import { css } from '@emotion/css';
import {
    EuiStepsHorizontal,
    EuiStepsHorizontalProps,
    makeHighContrastColor,
} from '@elastic/eui';
import React from 'react';

export const WFOTimeline = () => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    // Styles
    const stepCompleteStyle = css({
        '.euiStepNumber': {
            backgroundColor: toSecondaryColor(theme.colors.primary),
            color: makeHighContrastColor(theme.colors.primaryText)(
                toSecondaryColor(theme.colors.primary),
            ),
            '.euiIcon': {
                display: 'none',
            },
        },
    });

    const stepWarningStyle = css({
        '.euiStepNumber': {
            backgroundColor: toSecondaryColor(theme.colors.warning),
            borderColor: toSecondaryColor(theme.colors.warning),
            color: makeHighContrastColor(theme.colors.warningText)(
                toSecondaryColor(theme.colors.warning),
            ),
            '.euiIcon': {
                display: 'none',
            },
        },
    });

    const stepErrorStyle = css({
        '.euiStepNumber': {
            backgroundColor: toSecondaryColor(theme.colors.danger),
            borderColor: toSecondaryColor(theme.colors.danger),
            color: makeHighContrastColor(theme.colors.danger)(
                toSecondaryColor(theme.colors.warning),
            ),
        },
    });

    const stepIncompleteStyle = css({
        '.euiStepNumber__number': {
            display: 'none',
        },
    });

    // Reuse / override
    // const testStyle = css([
    //     stepCompleteStyle,
    //     {
    //         '.euiStepNumber': {
    //             backgroundColor: 'red',
    //         },
    //     },
    // ]);

    const horizontalSteps: EuiStepsHorizontalProps['steps'] = [
        // complete
        {
            status: 'complete',
            css: stepCompleteStyle,
            onClick: () => {},
        },
        // warning
        {
            // @ts-ignore
            step: 9, // number of retries
            css: stepWarningStyle,
            onClick: () => {},
        },
        // error
        {
            status: 'danger',
            css: stepErrorStyle,
            onClick: () => {},
        },
        // current
        {
            status: 'loading',
            onClick: () => {},
        },
        // future step
        {
            css: stepIncompleteStyle,
            // title: 'Disabled step 4',
            onClick: () => {},
        },
    ];

    return (
        <div>
            <div
                css={{
                    backgroundColor: theme.colors.body,
                    borderRadius: theme.border.radius.medium,
                }}
            >
                <EuiStepsHorizontal steps={horizontalSteps} size={'s'} />
            </div>
        </div>
    );
};
