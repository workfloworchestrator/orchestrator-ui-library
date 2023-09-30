import React, { LegacyRef } from 'react';
import {
    EuiCodeBlock,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { useOrchestratorTheme } from '../../../hooks';
import type { StepState, Step, EmailState } from '../../../types';
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
    showHiddenKeys: boolean;
}

export const WFOStep = React.forwardRef(
    (
        {
            step,
            delta,
            stepDetailIsOpen,
            toggleStepDetailIsOpen,
            stepIndex,
            startedAt,
            showHiddenKeys,
        }: WFOStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const { name, executed, status } = step;
        const { theme } = useOrchestratorTheme();
        const {
            stepEmailContainerStyle,
            stepHeaderStyle,
            stepHeaderRightStyle,
            stepListContentBoldTextStyle,
            stepDurationStyle,
            stepToggleExpandStyle,
            stepRowStyle,
        } = getStyles(theme);
        const t = useTranslations('processes.steps');
        const hasHtmlMail = delta?.hasOwnProperty('confirmation_mail');
        const HIDDEN_KEYS = ['label_', 'divider_', '__', 'confirmation_mail'];

        // Todo: refactor into something pure and beautiful
        let filteredStepDelta = delta;
        let filteredStepDeltaEmpty = false;
        if (!showHiddenKeys) {
            filteredStepDeltaEmpty = true;
            filteredStepDelta = {};
            for (const key in delta) {
                if (!HIDDEN_KEYS.some((word) => key.startsWith(word))) {
                    filteredStepDeltaEmpty = false;
                    filteredStepDelta[key] = delta[key];
                }
            }
        }

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
                    <EuiFlexGroup css={stepHeaderStyle}>
                        <WFOStepStatusIcon stepStatus={status} />

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
                                        css={stepToggleExpandStyle}
                                        onClick={() =>
                                            toggleStepDetailIsOpen(stepIndex)
                                        }
                                    >
                                        {(stepDetailIsOpen && (
                                            <WFOChevronUp />
                                        )) || <WFOChevronDown />}
                                    </EuiFlexItem>
                                </>
                            )}
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                    {stepDetailIsOpen && !filteredStepDeltaEmpty && (
                        <EuiCodeBlock
                            isCopyable={true}
                            language={'json'}
                            lineNumbers={true}
                            overflowHeight={6000}
                        >
                            {JSON.stringify(filteredStepDelta, null, 4)}
                        </EuiCodeBlock>
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

WFOStep.displayName = 'WFOStep';
