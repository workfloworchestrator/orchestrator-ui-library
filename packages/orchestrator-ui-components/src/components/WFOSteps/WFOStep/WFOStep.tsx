import React from 'react';
import {
    EuiCodeBlock,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '../../../hooks';
import type { StepState, Step } from '../../../types';
import { WFOStepStatusIcon } from '../WFOStepStatusIcon';
import { getStyles } from '../getStyles';
import { formatDate } from '../../../utils';
import { WFOChevronDown, WFOChevronUp } from '../../../icons';
import { calculateTimeDifference } from '../../../utils';

export interface WFOStepProps {
    step: Step;
    delta: StepState;
    stepIndex: number;
    stepDetailIsOpen: boolean;
    toggleStepDetailIsOpen: (index: number) => void;
    startedAt: string;
}

export const WFOStep = ({
    step,
    delta,
    stepDetailIsOpen,
    toggleStepDetailIsOpen,
    stepIndex,
    startedAt,
}: WFOStepProps) => {
    const { name, executed, status } = step;
    const { theme } = useOrchestratorTheme();
    const {
        stepHeaderStyle,
        stepHeaderRightStyle,
        stepListContentBoldTextStyle,
        stepDurationStyle,
        stepToggleExpandStyle,
        stepRowStyle,
    } = getStyles(theme);
    const t = useTranslations('processes.steps');

    return (
        <EuiPanel>
            <EuiFlexGroup css={stepHeaderStyle}>
                <WFOStepStatusIcon stepStatus={status} />

                <EuiFlexItem grow={0}>
                    <EuiText css={stepListContentBoldTextStyle}>{name}</EuiText>
                    <EuiText>
                        {status} {executed && `- ${formatDate(executed)}`}
                    </EuiText>
                </EuiFlexItem>

                <EuiFlexGroup css={stepRowStyle}>
                    {step.executed && (
                        <>
                            <EuiFlexItem grow={0} css={stepHeaderRightStyle}>
                                <EuiText css={stepDurationStyle}>
                                    {t('duration')}
                                </EuiText>
                                <EuiText size="m">
                                    {calculateTimeDifference(
                                        startedAt,
                                        step.executed,
                                    )}
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem
                                grow={0}
                                css={stepToggleExpandStyle}
                                onClick={() =>
                                    toggleStepDetailIsOpen(stepIndex)
                                }
                            >
                                {(stepDetailIsOpen && <WFOChevronUp />) || (
                                    <WFOChevronDown />
                                )}
                            </EuiFlexItem>
                        </>
                    )}
                </EuiFlexGroup>
            </EuiFlexGroup>
            {stepDetailIsOpen && (
                <EuiCodeBlock
                    isCopyable={true}
                    language={'json'}
                    lineNumbers={true}
                    overflowHeight={6000}
                >
                    {JSON.stringify(delta, null, 3)}
                </EuiCodeBlock>
            )}
        </EuiPanel>
    );
};
