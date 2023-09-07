import { useOrchestratorTheme } from '../../hooks';
import { EuiStepsHorizontal, EuiStepsHorizontalProps } from '@elastic/eui';
import React, { FC } from 'react';
import { EuiStepStatus } from '@elastic/eui/src/components/steps/step_number';
import { EuiStepHorizontalProps } from '@elastic/eui/src/components/steps/step_horizontal';
import { getStyles } from './styles';
import { SerializedStyles } from '@emotion/react';

export enum TimelineStatus {
    Complete = 'complete',
    Warning = 'warning',
    Error = 'error',
    Incomplete = 'incomplete',
    InProgress = 'inProgress',
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
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    const {
        stepWarningStyle,
        stepIncompleteStyle,
        stepCompleteStyle,
        stepErrorStyle,
        stepHideIconStyle,
    } = getStyles(theme, toSecondaryColor);

    const mapTimelineStatusToEuiStepStatus = (
        timelineStatus: TimelineStatus,
    ): EuiStepStatus => {
        switch (timelineStatus) {
            case TimelineStatus.Complete:
                return 'complete';
            case TimelineStatus.Warning:
                return 'warning';
            case TimelineStatus.Error:
                return 'danger';
            case TimelineStatus.Incomplete:
                return 'incomplete';
            case TimelineStatus.InProgress:
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
            case TimelineStatus.Error:
                return getOptionalIconStyle(stepErrorStyle, showIcon);
            case TimelineStatus.Incomplete:
                return getOptionalIconStyle(stepIncompleteStyle, showIcon);
            case TimelineStatus.InProgress:
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
        <div
            css={{
                backgroundColor: theme.colors.body,
                borderRadius: theme.border.radius.medium,
            }}
        >
            <EuiStepsHorizontal steps={horizontalSteps} size={'s'} />
        </div>
    );
};
