import { useOrchestratorTheme } from '../../hooks';
import {
    EuiStepsHorizontal,
    EuiStepsHorizontalProps,
    useEuiScrollBar,
} from '@elastic/eui';
import React, { FC } from 'react';
import { EuiStepStatus } from '@elastic/eui/src/components/steps/step_number';
import { EuiStepHorizontalProps } from '@elastic/eui/src/components/steps/step_horizontal';
import { getStyles } from './styles';
import { SerializedStyles } from '@emotion/react';
import { StepStatus } from '../../types';

export type TimelineItem = {
    processStepStatus: StepStatus;
    value?: number | 'icon';
    onClick: () => void;
};

export type WFOTimelineProps = {
    items: TimelineItem[];
};

export const WFOTimeline: FC<WFOTimelineProps> = ({ items }) => {
    const { theme } = useOrchestratorTheme();
    const {
        stepWarningStyle,
        stepIncompleteStyle,
        stepCompleteStyle,
        stepErrorStyle,
        stepHideIconStyle,
        timelinePanelStyle,
    } = getStyles(theme);

    const mapProcessStepStatusToEuiStepStatus = (
        processStepStatus: StepStatus,
    ): EuiStepStatus => {
        switch (processStepStatus) {
            case StepStatus.SUCCESS:
            case StepStatus.SKIPPED:
            case StepStatus.COMPLETE:
                return 'complete';
            case StepStatus.FAILED:
                return 'danger';
            case StepStatus.RUNNING:
                return 'loading';
            case StepStatus.SUSPEND:
                return 'warning';
            case StepStatus.PENDING:
            default:
                return 'incomplete';
        }
    };

    const getStyleForProcessStepStatus = (
        processStepStatus: StepStatus,
        showIcon: boolean,
    ) => {
        const getOptionalIconStyle = (
            style: SerializedStyles,
            showIcon: boolean,
        ): SerializedStyles | SerializedStyles[] =>
            showIcon ? style : [style, stepHideIconStyle];

        switch (processStepStatus) {
            case StepStatus.SUCCESS:
            case StepStatus.SKIPPED:
            case StepStatus.COMPLETE:
                return getOptionalIconStyle(stepCompleteStyle, showIcon);
            case StepStatus.SUSPEND:
                return getOptionalIconStyle(stepWarningStyle, showIcon);
            case StepStatus.FAILED:
                return getOptionalIconStyle(stepErrorStyle, showIcon);
            case StepStatus.PENDING:
                return getOptionalIconStyle(stepIncompleteStyle, showIcon);
            case StepStatus.RUNNING:
            default:
                return undefined;
        }
    };

    const horizontalSteps: EuiStepsHorizontalProps['steps'] = items.map(
        ({ processStepStatus, value, onClick }): EuiStepHorizontalProps => {
            const euiStepStatus =
                mapProcessStepStatusToEuiStepStatus(processStepStatus);

            return {
                status: typeof value === 'number' ? undefined : euiStepStatus,
                step: typeof value === 'number' ? value : undefined,
                css: getStyleForProcessStepStatus(
                    processStepStatus,
                    value === 'icon',
                ),
                onClick: () => onClick(),
            };
        },
    );

    return (
        <div css={[timelinePanelStyle, useEuiScrollBar()]}>
            <EuiStepsHorizontal steps={horizontalSteps} size={'s'} />
        </div>
    );
};
