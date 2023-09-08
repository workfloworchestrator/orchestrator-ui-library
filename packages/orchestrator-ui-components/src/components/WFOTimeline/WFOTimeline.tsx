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

export enum TimelineStatus {
    Complete = 'complete',
    Warning = 'warning',
    Failed = 'failed',
    Pending = 'pending',
    Running = 'running',
}

export type TimelineItem = {
    timelineStatus: TimelineStatus;
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

    const mapTimelineStatusToEuiStepStatus = (
        timelineStatus: TimelineStatus,
    ): EuiStepStatus => {
        switch (timelineStatus) {
            case TimelineStatus.Complete:
                return 'complete';
            case TimelineStatus.Warning:
                return 'warning';
            case TimelineStatus.Failed:
                return 'danger';
            case TimelineStatus.Pending:
                return 'incomplete';
            case TimelineStatus.Running:
                return 'loading';
        }
    };

    const getStyleForTimelineStatus = (
        timelineStatus: TimelineStatus,
        showIcon: boolean,
    ) => {
        const getOptionalIconStyle = (
            style: SerializedStyles,
            showIcon: boolean,
        ): SerializedStyles | SerializedStyles[] =>
            showIcon ? style : [style, stepHideIconStyle];

        switch (timelineStatus) {
            case TimelineStatus.Complete:
                return getOptionalIconStyle(stepCompleteStyle, showIcon);
            case TimelineStatus.Warning:
                return getOptionalIconStyle(stepWarningStyle, showIcon);
            case TimelineStatus.Failed:
                return getOptionalIconStyle(stepErrorStyle, showIcon);
            case TimelineStatus.Pending:
                return getOptionalIconStyle(stepIncompleteStyle, showIcon);
            case TimelineStatus.Running:
            default:
                return undefined;
        }
    };

    const horizontalSteps: EuiStepsHorizontalProps['steps'] = items.map(
        ({ timelineStatus, value, onClick }): EuiStepHorizontalProps => {
            const euiStatus = mapTimelineStatusToEuiStepStatus(timelineStatus);

            return {
                status: typeof value === 'number' ? undefined : euiStatus,
                step: typeof value === 'number' ? value : undefined,
                css: getStyleForTimelineStatus(
                    timelineStatus,
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
