import React, { FC } from 'react';
import { ReactNode } from 'react';

import { useEuiScrollBar } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { StepStatus } from '@/types';

import { WfoTimelineStep } from './WfoTimelineStep';
import { getTimelineStyles } from './styles';
import { getTimelinePosition } from './timelineUtils';

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

export type WfoTimelineProps = {
  timelineItems: TimelineItem[];
  indexOfCurrentStep?: number;
  onStepClick: (timelineItem: TimelineItem) => void;
  /** Show the name of this step under its marker (makes the timeline taller) */
  labelIndex?: number;
  labelColor?: string;
};

export const WfoTimeline: FC<WfoTimelineProps> = ({
  timelineItems,
  indexOfCurrentStep = 0,
  onStepClick,
  labelIndex,
  labelColor,
}) => {
  const { timelinePanelStyle, labelRoomStyle } = useWithOrchestratorTheme(getTimelineStyles);

  const mapTimelineItemToStep = (timelineItem: TimelineItem, index: number, allTimelineItems: TimelineItem[]) => {
    const { id, stepDetail, processStepStatus, value } = timelineItem;

    return (
      <WfoTimelineStep
        key={index}
        isFirstStep={index === 0}
        isLastStep={index === allTimelineItems.length - 1}
        stepStatus={processStepStatus}
        tooltipContent={stepDetail}
        timelinePosition={getTimelinePosition(index, indexOfCurrentStep)}
        onClick={id ? () => onStepClick(timelineItem) : undefined}
        label={index === labelIndex && typeof stepDetail === 'string' ? stepDetail : undefined}
        labelColor={labelColor}
      >
        {value}
      </WfoTimelineStep>
    );
  };

  return (
    <div css={[timelinePanelStyle, labelIndex !== undefined && labelRoomStyle, useEuiScrollBar()]}>
      {timelineItems.map(mapTimelineItemToStep)}
    </div>
  );
};
