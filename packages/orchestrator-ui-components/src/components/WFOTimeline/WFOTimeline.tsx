import React, { FC } from 'react';
import { StepStatus } from '../../types';
import { ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { EuiToolTip } from '@elastic/eui';

export enum TimelinePosition {
    PAST = 'past',
    CURRENT = 'current',
    FUTURE = 'future',
}

export type TimelineItem = {
    processStepStatus: StepStatus;
    value?: string | ReactNode;
    onClick: () => void;
};

export type WFOTimelineProps = {
    timelineItems: TimelineItem[];
    indexOfCurrentStep?: number;
};

export const WFOTimeline: FC<WFOTimelineProps> = ({
    timelineItems,
    indexOfCurrentStep = 0,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        timelinePanelStyle,
        stepStyle,
        getStepLineStyle,
        stepOuterCircleStyle,
        getStepInnerCircleStyle,
    } = getStyles(theme);

    const WFOStep = ({
        stepStatus,
        timelinePosition,
        isFirstStep = false,
        isLastStep = false,
        children,
    }: {
        stepStatus: StepStatus;
        timelinePosition: TimelinePosition;
        isFirstStep?: boolean;
        isLastStep?: boolean;
        children?: ReactNode;
    }) => (
        <button
            css={[
                stepStyle,
                getStepLineStyle(timelinePosition, isFirstStep, isLastStep),
            ]}
        >
            <EuiToolTip position="top" content="Here is some tooltip text">
                <div css={stepOuterCircleStyle(!!children)}>
                    <div css={getStepInnerCircleStyle(stepStatus, !!children)}>
                        {children}
                    </div>
                </div>
            </EuiToolTip>
        </button>
    );

    const getTimelinePosition = (index: number, indexOfCurrentStep: number) => {
        if (index === indexOfCurrentStep) {
            return TimelinePosition.CURRENT;
        }

        return index < indexOfCurrentStep
            ? TimelinePosition.PAST
            : TimelinePosition.FUTURE;
    };

    return (
        <div css={timelinePanelStyle}>
            {timelineItems.map((item, index, array) => (
                <WFOStep
                    key={index}
                    isFirstStep={index === 0}
                    isLastStep={index === array.length - 1}
                    stepStatus={item.processStepStatus}
                    timelinePosition={getTimelinePosition(
                        index,
                        indexOfCurrentStep,
                    )}
                >
                    {item.value}
                </WFOStep>
            ))}
        </div>
    );
};
