import React from 'react';

import { EuiFlexItem } from '@elastic/eui';

import { useOrchestratorTheme } from '../../../hooks';
import { WfoCheckmarkCircleFill, WfoPlayFill } from '../../../icons';
import { WfoXCircleFill } from '../../../icons';
import { WfoMinusCircleFill } from '../../../icons';
import { WfoCogFill } from '../../../icons/WfoCogFill';
import { WfoPencilAlt } from '../../../icons/WfoPencilAlt';
import { StepStatus } from '../../../types';
import { getStyles } from '../styles';

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
    } = getStyles(theme);

    const [
        stepStateStyle,
        mainIconColor,
        hasSubIcon = false,
        subIconColor = '',
    ] = (() => {
        switch (stepStatus) {
            case StepStatus.SUSPEND:
                return [stepStateSuspendIconStyle, '#8E6A00', true, '#8E6A00'];
            case StepStatus.PENDING:
                return [stepStatePendingIconStyle, '#94A4B8'];
            case StepStatus.FAILED:
                return [
                    stepStateFailedIconStyle,
                    '#AC0A01',
                    true,
                    theme.colors.danger,
                ];
            case StepStatus.SKIPPED:
                return [
                    stepStateSuccessIconStyle,
                    theme.colors.primaryText,
                    true,
                    theme.colors.accent,
                ];
            case StepStatus.FORM:
                return [stepStateSuccessIconStyle, theme.colors.link];

            default:
                return [
                    stepStateSuccessIconStyle,
                    theme.colors.link,
                    true,
                    theme.colors.success,
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
