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
    stepDetail?: string | ReactNode;
    value?: string | ReactNode;
};

export type WFOTimelineProps = {
    timelineItems: TimelineItem[];
    indexOfCurrentStep?: number;
    onStepClick: (timelineItem: TimelineItem) => void;
};

export const WFOTimeline: FC<WFOTimelineProps> = ({
    timelineItems,
    indexOfCurrentStep = 0,
    onStepClick,
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
        tooltipContent,
        isFirstStep = false,
        isLastStep = false,
        children,
        onClick,
    }: {
        stepStatus: StepStatus;
        timelinePosition: TimelinePosition;
        tooltipContent?: string | ReactNode;
        isFirstStep?: boolean;
        isLastStep?: boolean;
        children?: ReactNode;
        onClick: () => void;
    }) => (
        <button
            css={[
                stepStyle,
                getStepLineStyle(timelinePosition, isFirstStep, isLastStep),
            ]}
            onClick={() => onClick()}
        >
            <EuiToolTip position="top" content={tooltipContent}>
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
                    tooltipContent={item.stepDetail}
                    timelinePosition={getTimelinePosition(
                        index,
                        indexOfCurrentStep,
                    )}
                    onClick={() => onStepClick(item)}
                >
                    {item.value}
                </WFOStep>
            ))}
        </div>
    );
};
