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
};

export const WfoTimelineStep = ({
    stepStatus,
    timelinePosition,
    tooltipContent,
    isFirstStep = false,
    isLastStep = false,
    children,
    onClick,
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
                <div css={getStepOuterCircleStyle(!!children)}>
                    <div css={getStepInnerCircleStyle(stepStatus, !!children)}>
                        {children}
                    </div>
                </div>
            </EuiToolTip>
        </button>
    );
};
