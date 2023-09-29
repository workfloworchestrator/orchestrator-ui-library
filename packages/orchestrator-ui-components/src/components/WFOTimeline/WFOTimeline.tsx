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
    id?: string;
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
        const { id, stepDetail, processStepStatus, value } = timelineItem;

        return (
            <WFOTimelineStep
                key={index}
                isFirstStep={index === 0}
                isLastStep={index === allTimelineItems.length - 1}
                stepStatus={processStepStatus}
                tooltipContent={stepDetail}
                timelinePosition={getTimelinePosition(
                    index,
                    indexOfCurrentStep,
                )}
                onClick={id ? () => onStepClick(timelineItem) : undefined}
            >
                {value}
            </WFOTimelineStep>
        );
    };

    return (
        <div css={[timelinePanelStyle, useEuiScrollBar()]}>
            {timelineItems.map(mapTimelineItemToStep)}
        </div>
    );
};
