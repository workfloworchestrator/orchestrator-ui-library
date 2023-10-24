import React, { LegacyRef } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '../../../hooks';
import type { StepState, Step, EmailState } from '../../../types';
import { WfoStepStatusIcon } from '../WfoStepStatusIcon';
import { getStyles } from '../styles';
import { formatDate } from '../../../utils';
import { WfoChevronDown, WfoChevronUp } from '../../../icons';
import { calculateTimeDifference } from '../../../utils';
import { getStepContent } from '../stepListUtils';
import { WfoJsonCodeBlock } from '../../WfoJsonCodeBlock/WfoJsonCodeBlock';

export interface WfoStepProps {
    step: Step;
    stepDelta: StepState;
    stepDetailIsOpen: boolean;
    startedAt: string;
    showHiddenKeys: boolean;
    onToggleStepDetail: () => void;
    isStartStep?: boolean;
}

export const WfoStep = React.forwardRef(
    (
        {
            step,
            stepDelta,
            stepDetailIsOpen,
            onToggleStepDetail,
            startedAt,
            showHiddenKeys,
            isStartStep = false,
        }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const { name, executed, status } = step;
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
        const t = useTranslations('processes.steps');
        const hasHtmlMail = stepDelta?.hasOwnProperty('confirmation_mail');

        const stepContent = getStepContent(stepDelta, showHiddenKeys);
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
                        <WfoStepStatusIcon
                            stepStatus={status}
                            isStartStep={isStartStep}
                        />

                        <EuiFlexItem grow={0}>
                            <EuiText css={stepListContentBoldTextStyle}>
                                {name}
                            </EuiText>
                            <EuiText>
                                {status}{' '}
                                {executed && `- ${formatDate(executed)}`}
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
                                        css={getStepToggleExpandStyle(
                                            hasStepContent,
                                        )}
                                    >
                                        {(stepDetailIsOpen && (
                                            <WfoChevronUp />
                                        )) || <WfoChevronDown />}
                                    </EuiFlexItem>
                                </>
                            )}
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                    {hasStepContent && stepDetailIsOpen && (
                        <WfoJsonCodeBlock data={stepContent} />
                    )}
                    {stepDetailIsOpen && hasHtmlMail && (
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

WfoStep.displayName = 'WfoStep';
