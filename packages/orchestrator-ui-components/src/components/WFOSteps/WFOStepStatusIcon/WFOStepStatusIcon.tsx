import React from 'react';
import { getStyles } from '../getStyles';
import type { EuiThemeComputed } from '@elastic/eui';
import { useOrchestratorTheme } from '../../../hooks';
import { StepStatus } from '../../../types';
import { WFOCogFill } from '../../../icons/WFOCogFill';
import { WFOCheckmarkCircleFill } from '../../../icons';
import { WFOXCircleFill } from '../../../icons';
import { WFOMinusCircleFill } from '../../../icons';

export interface WFOStepStatusIconProps {
    stepStatus: StepStatus;
}

interface SubIconProps {
    stepStatus: StepStatus;
    theme: EuiThemeComputed;
}

const SubIcon = ({ stepStatus, theme }: SubIconProps) => {
    switch (stepStatus) {
        case StepStatus.PENDING:
            return <></>;
        case StepStatus.SUSPEND:
            return <WFOMinusCircleFill color={'#8E6A00'} />;
        case StepStatus.FAILED:
            return <WFOXCircleFill color={theme.colors.danger} />;
        default:
            return <WFOCheckmarkCircleFill color={theme.colors.success} />;
    }
};

export const WFOStepStatusIcon = ({ stepStatus }: WFOStepStatusIconProps) => {
    const { theme } = useOrchestratorTheme();

    const {
        stepStateSuccessIconStyle,
        stepStateSuspendIconStyle,
        stepStatePendingIconStyle,
        stepStateFailedIconStyle,
    } = getStyles(theme);

    const [stepStateStyle, mainIconColor] = (() => {
        switch (stepStatus) {
            case StepStatus.SUSPEND:
                return [stepStateSuspendIconStyle, '#8E6A00'];
            case StepStatus.PENDING:
                return [stepStatePendingIconStyle, '#94A4B8'];
            case StepStatus.FAILED:
                return [stepStateFailedIconStyle, '#AC0A01'];

            default:
                return [stepStateSuccessIconStyle, theme.colors.link];
        }
    })();

    return (
        <>
            <div css={stepStateStyle}>
                <WFOCogFill color={mainIconColor} width={16} height={16} />
            </div>

            <div
                css={{
                    transform: 'translate(-15px, -13px)',
                    width: `${theme.base}`,
                }}
            >
                <SubIcon theme={theme} stepStatus={stepStatus} />
            </div>
        </>
    );
};
