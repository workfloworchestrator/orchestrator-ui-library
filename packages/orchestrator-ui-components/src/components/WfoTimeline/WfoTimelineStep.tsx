import { StepStatus } from '../../types';
import React, { ReactNode } from 'react';
import { EuiToolTip } from '@elastic/eui';
import { TimelinePosition } from './WfoTimeline';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

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
    const { theme } = useOrchestratorTheme();
    const {
        stepStyle,
        clickableStyle,
        notClickableStyle,
        getStepLineStyle,
        getStepOuterCircleStyle,
        getStepInnerCircleStyle,
    } = getStyles(theme);

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
