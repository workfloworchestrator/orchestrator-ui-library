import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '../../../hooks';
import type { Step } from '../../../types';
import { WFOStepStatusIcon } from '../WFOStepStatusIcon';
import { getStyles } from '../getStyles';
import { formatDate } from '../../../utils';
import { WFOChevronDown, WFOChevronUp } from '../../../icons';

export interface WFOStepProps {
    step: Step;
    stepIndex: number;
    stepDetailIsOpen: boolean;
    toggleStepDetailIsOpen: (index: number) => void;
}

export const WFOStep = ({
    step,
    stepDetailIsOpen,
    toggleStepDetailIsOpen,
    stepIndex,
}: WFOStepProps) => {
    const { name, executed, status } = step;
    const { theme } = useOrchestratorTheme();
    const { stepListContentBoldTextStyle, stepDurationStyle } =
        getStyles(theme);
    const t = useTranslations('processes.steps');

    return (
        <EuiPanel>
            <EuiFlexGroup
                css={{
                    gap: 0,
                    alignItems: 'center',
                }}
            >
                <WFOStepStatusIcon stepStatus={status} />

                <EuiFlexItem grow={0}>
                    <EuiText css={stepListContentBoldTextStyle}>{name}</EuiText>
                    <EuiText>
                        {status} - {formatDate(executed)}
                    </EuiText>
                </EuiFlexItem>

                <EuiFlexGroup
                    css={{
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <EuiFlexItem grow={0} css={{ alignItems: 'center' }}>
                        <EuiText css={stepDurationStyle}>
                            {t('duration')}
                        </EuiText>
                        <EuiText size="m">00:00:06</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem
                        grow={0}
                        css={{ marginRight: '8px', cursor: 'pointer' }}
                        onClick={() => toggleStepDetailIsOpen(stepIndex)}
                    >
                        {(stepDetailIsOpen && <WFOChevronUp />) || (
                            <WFOChevronDown />
                        )}
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
