import React, { LegacyRef } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { WfoJsonCodeBlock } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { WfoChevronDown, WfoChevronUp } from '@/icons';
import type { EmailState } from '@/types';
import { StepStatus } from '@/types';
import { calculateTimeDifference, formatDate } from '@/utils';

import { WfoStepStatusIcon } from '../WfoStepStatusIcon';
import type { StepListItem } from '../WfoWorkflowStepList';
import { getStepContent } from '../stepListUtils';
import { getStyles } from '../styles';
import { WfoStepForm } from './WfoStepForm';

export interface WfoStepProps {
    stepListItem: StepListItem;
    startedAt: string;
    showHiddenKeys: boolean;
    onToggleStepDetail: () => void;
    isTask: boolean;
    isStartStep?: boolean;
    processId?: string;
}

export const WfoStep = React.forwardRef(
    (
        {
            stepListItem,
            onToggleStepDetail,
            startedAt,
            showHiddenKeys,
            isStartStep = false,
            isTask,
            processId,
        }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const { isExpanded, step, userInputForm } = stepListItem;

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
                        <WfoStepStatusIcon
                            stepStatus={step.status}
                            isStartStep={isStartStep}
                        />

                        <EuiFlexItem grow={0}>
                            <EuiText css={stepListContentBoldTextStyle}>
                                {step.name}
                            </EuiText>
                            <EuiText>
                                {step.status}{' '}
                                {step.executed &&
                                    `- ${formatDate(step.executed)}`}
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
                    {step.status === StepStatus.SUSPEND && userInputForm && (
                        <WfoStepForm
                            userInputForm={userInputForm}
                            isTask={isTask}
                            processId={processId}
                        />
                    )}
                </EuiPanel>
            </div>
        );
    },
);

WfoStep.displayName = 'WfoStep';
