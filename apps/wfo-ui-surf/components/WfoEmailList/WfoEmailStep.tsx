import React, { LegacyRef } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';
import {
    WfoChevronDown,
    WfoChevronUp,
    WfoContactEnvelopeFill,
    WfoJsonCodeBlock,
    calculateTimeDifference,
    formatDate,
    getStepContent,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { WfoAvatar } from '@/components/WfoAvatar/WfoAvatar';
import { getStyles } from '@/components/WfoEmailList/styles';
import { EmailListItem } from '@/types';

export interface WfoStepProps {
    emailListItem: EmailListItem;
    startedAt: string;
    showHiddenKeys: boolean;
    onToggleStepDetail: () => void;
}

export const WfoEmailStep = React.forwardRef(
    (
        {
            emailListItem,
            onToggleStepDetail,
            startedAt,
            showHiddenKeys,
        }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const { isExpanded, step } = emailListItem;

        const { theme } = useOrchestratorTheme();
        const {
            getStepHeaderStyle,
            stepHeaderRightStyle,
            stepListContentBoldTextStyle,
            stepDurationStyle,
            stepRowStyle,
            getStepToggleExpandStyle,
        } = getStyles(theme);

        const t = useTranslations(
            'cim.serviceTickets.detail.tabDetails.sentEmails',
        );

        const stepContent = step.stateDelta
            ? getStepContent(step.stateDelta, showHiddenKeys)
            : {};
        const hasStepContent = Object.keys(stepContent).length > 0;

        return (
            <div ref={ref}>
                <EuiPanel>
                    <EuiFlexGroup
                        css={getStepHeaderStyle(hasStepContent)}
                        onClick={() => hasStepContent && onToggleStepDetail()}
                    >
                        <WfoAvatar
                            stepStatus={step.status}
                            icon={<WfoContactEnvelopeFill />}
                            hasCheckmark={true}
                        />

                        <EuiFlexItem grow={0}>
                            <EuiText css={stepListContentBoldTextStyle}>
                                {step.name}
                            </EuiText>
                            <EuiText color={'subdued'}>
                                {`${t('sentOn')} ${formatDate(
                                    step.executed,
                                )} ${t('by')} ${step.sentBy}`}
                            </EuiText>
                        </EuiFlexItem>

                        <EuiFlexGroup css={stepRowStyle}>
                            {step.executed && (
                                <>
                                    <EuiFlexItem
                                        grow={0}
                                        css={stepHeaderRightStyle}
                                    >
                                        <EuiText css={stepDurationStyle}>
                                            {t('showMore')}
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
                                        css={getStepToggleExpandStyle(
                                            hasStepContent,
                                        )}
                                    >
                                        {(isExpanded && <WfoChevronUp />) || (
                                            <WfoChevronDown />
                                        )}
                                    </EuiFlexItem>
                                </>
                            )}
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                    {hasStepContent && isExpanded && (
                        <WfoJsonCodeBlock data={stepContent} />
                    )}
                </EuiPanel>
            </div>
        );
    },
);

WfoEmailStep.displayName = 'WfoEmailStep';
