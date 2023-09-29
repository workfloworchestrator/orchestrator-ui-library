import { StepStatus } from '../../types';
import React, { ReactNode } from 'react';
import { EuiToolTip } from '@elastic/eui';
import { TimelinePosition } from './WFOTimeline';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

export type WFOTimelineStepProps = {
    stepStatus: StepStatus;
    timelinePosition: TimelinePosition;
    tooltipContent?: string | ReactNode;
    isFirstStep?: boolean;
    isLastStep?: boolean;
    children?: ReactNode;
    onClick?: () => void;
};

export const WFOTimelineStep = ({
    stepStatus,
    timelinePosition,
    tooltipContent,
    isFirstStep = false,
    isLastStep = false,
    children,
    onClick,
}: WFOTimelineStepProps) => {
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
