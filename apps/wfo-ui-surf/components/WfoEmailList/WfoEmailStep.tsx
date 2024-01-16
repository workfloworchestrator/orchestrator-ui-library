import React, { LegacyRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonEmpty,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { EuiComboBoxOptionOption } from '@elastic/eui/src/components/combo_box/types';
import {
    WfoChevronDown,
    WfoChevronUp,
    WfoContactEnvelopeFill,
    WfoJsonCodeBlock,
    calculateTimeDifference,
    formatDate,
    getStepContent,
    upperCaseFirstChar,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { WfoAvatar } from '@/components/WfoAvatar/WfoAvatar';
import { WfoEmailStepContent } from '@/components/WfoEmailList/WfoEmailStepContent';
import { getStyles } from '@/components/WfoEmailList/styles';
import { WfoCustomersContactsModal } from '@/components/WfoServiceTicketDetailPage/WfoCustomersContactsModal';
import { CustomerWithContacts, EmailListItem } from '@/types';

export interface WfoStepProps {
    emailListItem: EmailListItem;
    showHiddenKeys: boolean;
    onToggleStepDetail: () => void;
}

export const WfoEmailStep = React.forwardRef(
    (
        { emailListItem, onToggleStepDetail, showHiddenKeys }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const t = useTranslations(
            'cim.serviceTickets.detail.tabDetails.sentEmails',
        );
        const { theme } = useOrchestratorTheme();
        const { isExpanded, step } = emailListItem;

        const {
            getStepHeaderStyle,
            stepHeaderRightStyle,
            stepListContentBoldTextStyle,
            stepDurationStyle,
            stepRowStyle,
            getStepToggleExpandStyle,
        } = getStyles(theme);

        const hasStepContent = step.emails?.length > 0;
        const sentOn = `${t('sentOn')} ${formatDate(step.executed)} ${t('by')}`;
        const stepShowLabel = isExpanded ? t('showLess') : t('showMore');

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
                            <EuiText color={'subdued'}>{sentOn}</EuiText>
                        </EuiFlexItem>

                        <EuiFlexGroup css={stepRowStyle}>
                            {step.executed && (
                                <>
                                    <EuiFlexItem
                                        grow={0}
                                        css={stepHeaderRightStyle}
                                    >
                                        <EuiText css={stepDurationStyle}>
                                            {stepShowLabel}
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
                        <WfoEmailStepContent emails={step.emails} />
                    )}
                </EuiPanel>
            </div>
        );
    },
);

WfoEmailStep.displayName = 'WfoEmailStep';
