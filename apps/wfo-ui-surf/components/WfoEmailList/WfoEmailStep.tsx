import React, { LegacyRef } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';
import {
    EmailState,
    StepListItem,
    WfoChevronDown,
    WfoChevronUp,
    WfoContactEnvelopeFill,
    WfoJsonCodeBlock,
    WfoStepStatusIcon,
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
    isStartStep?: boolean;
}

export const WfoEmailStep = React.forwardRef(
    (
        {
            emailListItem,
            onToggleStepDetail,
            startedAt,
            showHiddenKeys,
            isStartStep = false,
        }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const { isExpanded, step } = emailListItem;

        const { theme } = useOrchestratorTheme();
        const {
            stepEmailContainerStyle,
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
        const hasHtmlMail =
            step.stateDelta?.hasOwnProperty('confirmation_mail');

        const stepContent = step.stateDelta
            ? getStepContent(step.stateDelta, showHiddenKeys)
            : {};
        const hasStepContent = Object.keys(stepContent).length > 0;

        const displayMailConfirmation = (value: EmailState) => {
            if (!value) {
                return '';
            }
            return (
                <EuiText size="s">
                    <h4>To</h4>
                    <p>
                        {value.to.map(
                            (v: { email: string; name: string }, i) => (
                                <div key={`to-${i}`}>
                                    {v.name} &lt;
                                    <a href={`mailto: ${v.email}`}>{v.email}</a>
                                    &gt;
                                </div>
                            ),
                        )}
                    </p>
                    <h4>CC</h4>
                    <p>
                        {value.cc.map(
                            (v: { email: string; name: string }, i) => (
                                <div key={`cc-${i}`}>
                                    {v.name} &lt;
                                    <a href={`mailto: ${v.email}`}>{v.email}</a>
                                    &gt;
                                </div>
                            ),
                        )}
                    </p>
                    <h4>Subject</h4>
                    <p>{value.subject}</p>
                    <h4>Message</h4>
                    <div
                        className="emailMessage"
                        dangerouslySetInnerHTML={{ __html: value.message }}
                    ></div>
                </EuiText>
            );
        };

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
                    {isExpanded && hasHtmlMail && (
                        <div css={stepEmailContainerStyle}>
                            {displayMailConfirmation(
                                step.state.confirmation_mail as EmailState,
                            )}
                        </div>
                    )}
                </EuiPanel>
            </div>
        );
    },
);

WfoEmailStep.displayName = 'WfoEmailStep';
