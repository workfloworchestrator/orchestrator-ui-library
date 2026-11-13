import React, { ReactNode } from 'react';

import { EuiToolTip } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { StepStatus } from '@/types';

import { TimelinePosition } from './WfoTimeline';
import { getTimelineStyles } from './styles';

export type WfoTimelineStepProps = {
  stepStatus: StepStatus;
  timelinePosition: TimelinePosition;
  tooltipContent?: string | ReactNode;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  /** Name shown under the marker (used for the current or failed step) */
  label?: ReactNode;
  labelColor?: string;
};

export const WfoTimelineStep = ({
  stepStatus,
  timelinePosition,
  tooltipContent,
  isFirstStep = false,
  isLastStep = false,
  children,
  onClick,
  label,
  labelColor,
}: WfoTimelineStepProps) => {
  const {
    stepStyle,
    clickableStyle,
    notClickableStyle,
    getStepLineStyle,
    getStepOuterCircleStyle,
    getStepInnerCircleStyle,
  } = useWithOrchestratorTheme(getTimelineStyles);

  return (
    <button
      css={[
        stepStyle,
        onClick ? clickableStyle : notClickableStyle,
        getStepLineStyle(timelinePosition, isFirstStep, isLastStep),
      ]}
      onClick={() => onClick && onClick()}
    >
      <EuiToolTip position="top" content={tooltipContent}>
        <div css={[getStepOuterCircleStyle(!!children), { position: 'relative' }]}>
          <div css={getStepInnerCircleStyle(stepStatus, !!children)}>{children}</div>
          {label && (
            <span
              css={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 6,
                whiteSpace: 'nowrap',
                fontSize: 12,
                lineHeight: '16px',
                fontWeight: 600,
                color: labelColor,
              }}
            >
              {label}
            </span>
          )}
        </div>
      </EuiToolTip>
    </button>
  );
};
