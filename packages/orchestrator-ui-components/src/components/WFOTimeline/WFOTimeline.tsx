import { useOrchestratorTheme } from '../../hooks';
import { EuiSpacer, EuiStepsHorizontal, useEuiScrollBar } from '@elastic/eui';
import React, { FC } from 'react';
import { EuiStepHorizontalProps } from '@elastic/eui/src/components/steps/step_horizontal';
import { getStyles } from './styles';
import { SerializedStyles } from '@emotion/react';
import { StepStatus } from '../../types';
import { mapProcessStepStatusToEuiStepStatus } from './mapProcessStepStatusToEuiStepStatus';
import { WFOTimeline as WFOTimeline2 } from './WFOTimeline/WFOTimeline';
import { getIndexOfCurrentStep } from '../../pages/processes/timelineUtils';

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

        // value can be 'icon', a number or undefined. It represents the content of the circle
        // The underlying EUI component does not support empty steps, therefore status and step need to be set accordingly:
        if (typeof value === 'number') {
            return {
                status: undefined,
                step: value,
                css: getStyleForProcessStepStatus(processStepStatus, false),
                onClick: () => onClick(),
            };
        }

        if (value === 'icon') {
            return {
                status: euiStepStatus,
                step: undefined,
                css: getStyleForProcessStepStatus(processStepStatus, true),
                onClick: () => onClick(),
            };
        }

        // value is undefined
        return {
            status: euiStepStatus,
            step: undefined,
            css: getStyleForProcessStepStatus(processStepStatus, false),
            onClick: () => onClick(),
        };
    };

    // Todo Fix before opening PR
    // return (
    //     <div css={[timelinePanelStyle, useEuiScrollBar()]}>
    //         <EuiStepsHorizontal
    //             steps={timelineItems.map(mapTimelineItemToEuiStep)}
    //             size={'s'}
    //         />
    //     </div>
    // );

    return (
        <>
            <div css={[timelinePanelStyle, useEuiScrollBar()]}>
                <EuiStepsHorizontal
                    steps={timelineItems.map(mapTimelineItemToEuiStep)}
                    size={'s'}
                />
            </div>

            <EuiSpacer size="m" />
            <WFOTimeline2
                timelineItems={timelineItems}
                indexOfCurrentStep={getIndexOfCurrentStep(timelineItems)}
            />
        </>
    );
};
