import React from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import {
    WfoCheckmarkCircleFill,
    WfoCogFill,
    WfoMinusCircleFill,
    WfoPencilAlt,
    WfoPlayFill,
    WfoXCircleFill,
} from '@/icons';
import { StepStatus } from '@/types';

import { getWorkflowStepsStyles } from '../styles';

export interface WfoStepStatusIconProps {
    stepStatus: StepStatus;
    isStartStep?: boolean;
}

interface IconProps {
    stepStatus: StepStatus;
    color: string;
    isStartStep?: boolean;
}

const SubIcon = ({ stepStatus, color = '' }: IconProps) => {
    switch (stepStatus) {
        case StepStatus.SUSPEND:
            return <WfoMinusCircleFill color={color} />;
        case StepStatus.FAILED:
            return <WfoXCircleFill color={color} />;
        default:
            return <WfoCheckmarkCircleFill color={color} />;
    }
};

const MainIcon = ({ stepStatus, color = '', isStartStep }: IconProps) => {
    if (isStartStep) {
        return <WfoPlayFill color={color} />;
    }

    switch (stepStatus) {
        case StepStatus.FORM:
            return <WfoPencilAlt color={color} />;
        default:
            return <WfoCogFill color={color} width={16} height={16} />;
    }
};

export const WfoStepStatusIcon = ({
    stepStatus,
    isStartStep = false,
}: WfoStepStatusIconProps) => {
    const { theme } = useOrchestratorTheme();

    const {
        stepStateSuccessIconStyle,
        stepStateSuspendIconStyle,
        stepStatePendingIconStyle,
        stepStateFailedIconStyle,
    } = useWithOrchestratorTheme(getWorkflowStepsStyles);

    const [
        stepStateStyle,
        mainIconColor,
        hasSubIcon = false,
        subIconColor = '',
    ] = (() => {
        switch (stepStatus) {
            case StepStatus.SUSPEND:
                return [
                    stepStateSuspendIconStyle,
                    theme.colors.textWarning,
                    true,
                    theme.colors.textWarning,
                ];
            case StepStatus.PENDING:
                return [
                    stepStatePendingIconStyle,
                    theme.colors.backgroundBaseAccent,
                ];
            case StepStatus.FAILED:
                return [
                    stepStateFailedIconStyle,
                    theme.colors.textDanger,
                    true,
                    theme.colors.textDanger,
                ];
            case StepStatus.SKIPPED:
                return [
                    stepStateSuccessIconStyle,
                    theme.colors.textPrimary,
                    true,
                    theme.colors.backgroundBaseAccent,
                ];
            case StepStatus.FORM:
                return [stepStateSuccessIconStyle, theme.colors.link];

            default:
                return [
                    stepStateSuccessIconStyle,
                    theme.colors.textPrimary,
                    true,
                    theme.colors.textSuccess,
                ];
        }
    })();

    return (
        <EuiFlexItem css={{ flexDirection: 'row' }} grow={0}>
            <div css={stepStateStyle}>
                <MainIcon
                    color={mainIconColor}
                    stepStatus={stepStatus}
                    isStartStep={isStartStep}
                />
            </div>

            <div
                css={{
                    transform: 'translate(-16px, -8px)',
                    width: `${theme.base}`,
                    visibility: hasSubIcon ? 'visible' : 'hidden',
                }}
            >
                <SubIcon color={subIconColor} stepStatus={stepStatus} />
            </div>
        </EuiFlexItem>
    );
};
