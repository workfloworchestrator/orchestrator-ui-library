import React, { useState, useEffect } from 'react';
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
    forceDetailOpen: boolean;
}

export const WFOStep = ({ step, forceDetailOpen = false }: WFOStepProps) => {
    const [detailIsOpen, setDetailIsOpen] = useState<boolean>(false);
    const { name, executed, status } = step;
    const { theme } = useOrchestratorTheme();
    const { stepListContentBoldTextStyle, stepDurationStyle } =
        getStyles(theme);
    const t = useTranslations('processes.steps');

    useEffect(() => {
        if (forceDetailOpen) {
            setDetailIsOpen(true);
        }
    }, [forceDetailOpen]);

    const toggleDetailOpen = () => setDetailIsOpen((openState) => !openState);

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
                        {t(status)} - {formatDate(executed)}
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
                        css={{ marginRight: '8px' }}
                        onClick={toggleDetailOpen}
                    >
                        {(detailIsOpen && <WFOChevronUp />) || (
                            <WFOChevronDown />
                        )}
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
