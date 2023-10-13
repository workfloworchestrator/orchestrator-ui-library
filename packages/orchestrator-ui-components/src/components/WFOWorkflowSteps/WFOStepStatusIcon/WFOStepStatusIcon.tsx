import React from 'react';
import { getStyles } from '../styles';
import { EuiFlexItem } from '@elastic/eui';
import { useOrchestratorTheme } from '../../../hooks';
import { StepStatus } from '../../../types';
import { WFOCogFill } from '../../../icons/WFOCogFill';
import { WFOCheckmarkCircleFill, WFOPlayFill } from '../../../icons';
import { WFOXCircleFill } from '../../../icons';
import { WFOMinusCircleFill } from '../../../icons';
import { WFOPencilAlt } from '../../../icons/WFOPencilAlt';

export interface WFOStepStatusIconProps {
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
            return <WFOMinusCircleFill color={color} />;
        case StepStatus.FAILED:
            return <WFOXCircleFill color={color} />;
        default:
            return <WFOCheckmarkCircleFill color={color} />;
    }
};

const MainIcon = ({ stepStatus, color = '', isStartStep }: IconProps) => {
    if (isStartStep) {
        return <WFOPlayFill color={color} />;
    }

    switch (stepStatus) {
        case StepStatus.FORM:
            return <WFOPencilAlt color={color} />;
        default:
            return <WFOCogFill color={color} width={16} height={16} />;
    }
};

export const WFOStepStatusIcon = ({
    stepStatus,
    isStartStep = false,
}: WFOStepStatusIconProps) => {
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
