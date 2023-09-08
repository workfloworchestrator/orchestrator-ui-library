import { useOrchestratorTheme } from '../../hooks';
import { EuiStepsHorizontal, useEuiScrollBar } from '@elastic/eui';
import React, { FC } from 'react';
import { EuiStepHorizontalProps } from '@elastic/eui/src/components/steps/step_horizontal';
import { getStyles } from './styles';
import { SerializedStyles } from '@emotion/react';
import { StepStatus } from '../../types';
import { mapProcessStepStatusToEuiStepStatus } from './mapProcessStepStatusToEuiStepStatus';

export type TimelineItem = {
    processStepStatus: StepStatus;
    value?: number | 'icon';
    onClick: () => void;
};

export type WFOTimelineProps = {
    timelineItems: TimelineItem[];
};

export const WFOTimeline: FC<WFOTimelineProps> = ({ timelineItems }) => {
    const { theme } = useOrchestratorTheme();
    const {
        stepWarningStyle,
        stepIncompleteStyle,
        stepCompleteStyle,
        stepErrorStyle,
        stepHideIconStyle,
        timelinePanelStyle,
    } = getStyles(theme);

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

    const mapTimelineItemToEuiStep = ({
        processStepStatus,
        value,
        onClick,
    }: TimelineItem): EuiStepHorizontalProps => {
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
    };

    return (
        <div css={[timelinePanelStyle, useEuiScrollBar()]}>
            <EuiStepsHorizontal
                steps={timelineItems.map(mapTimelineItemToEuiStep)}
                size={'s'}
            />
        </div>
    );
};
