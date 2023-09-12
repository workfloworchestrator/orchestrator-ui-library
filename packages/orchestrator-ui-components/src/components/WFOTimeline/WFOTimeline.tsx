import React, { FC } from 'react';
import { StepStatus } from '../../types';
import { ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { getTimelinePosition } from './timelineUtils';
import { WFOTimelineStep } from './WFOTimelineStep';
import { useEuiScrollBar } from '@elastic/eui';

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
    const { timelinePanelStyle } = getStyles(theme);

    const mapTimelineItemToStep = (
        timelineItem: TimelineItem,
        index: number,
        allTimelineItems: TimelineItem[],
    ) => {
        return (
            <WFOTimelineStep
                key={index}
                isFirstStep={index === 0}
                isLastStep={index === allTimelineItems.length - 1}
                stepStatus={timelineItem.processStepStatus}
                tooltipContent={timelineItem.stepDetail}
                timelinePosition={getTimelinePosition(
                    index,
                    indexOfCurrentStep,
                )}
                onClick={() => onStepClick(timelineItem)}
            >
                {timelineItem.value}
            </WFOTimelineStep>
        );
    };

    return (
        <div css={[timelinePanelStyle, useEuiScrollBar()]}>
            {timelineItems.map(mapTimelineItemToStep)}
        </div>
    );
};
