import React, { LegacyRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';

import { WfoJsonCodeBlock, WfoTableCodeBlock } from '@/components';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoChevronDown, WfoChevronUp } from '@/icons';
import type { EmailState } from '@/types';
import { StepStatus } from '@/types';
import { FormUserPermissions } from '@/types/forms';
import { calculateTimeDifference, formatDate } from '@/utils';

import { WfoStepStatusIcon } from '../WfoStepStatusIcon';
import type { StepListItem } from '../WfoWorkflowStepList';
import { getStepContent } from '../stepListUtils';
import { getWorkflowStepsStyles } from '../styles';
import { WfoStepForm } from './WfoStepForm';

export interface WfoStepProps {
    stepListItem: StepListItem;
    startedAt: string;
    completedAt: string;
    showHiddenKeys: boolean;
    onToggleStepDetail: () => void;
    isTask: boolean;
    isStartStep?: boolean;
    processId?: string;
    userPermissions: FormUserPermissions;
}

export const WfoStep = React.forwardRef(
    (
        {
            stepListItem,
            onToggleStepDetail,
            startedAt,
            completedAt,
            showHiddenKeys,
            isStartStep = false,
            isTask,
            processId,
            userPermissions,
        }: WfoStepProps,
        ref: LegacyRef<HTMLDivElement>,
    ) => {
        const { isExpanded, step, userInputForm } = stepListItem;
        const [tableView, setTableView] = useState<boolean>(false);

        const { theme } = useOrchestratorTheme();
        const {
            stepEmailContainerStyle,
            getStepHeaderStyle,
            stepHeaderRightStyle,
            stepListContentBoldTextStyle,
            stepDurationStyle,
            stepRowStyle,
            getStepToggleExpandStyle,
        } = useWithOrchestratorTheme(getWorkflowStepsStyles);
        const t = useTranslations('processes.steps');
        const hasHtmlMail = Object.prototype.hasOwnProperty.call(
            step?.stateDelta || {},
            'confirmation_mail',
        );

        const stepContent = step.stateDelta
            ? getStepContent(step.stateDelta, showHiddenKeys)
            : {};
        const hasStepContent =
            hasHtmlMail || Object.keys(stepContent).length > 0;

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
                                {step.completed &&
                                    `- ${formatDate(step.completed)}`}
                            </EuiText>
                        </EuiFlexItem>

                        <EuiFlexGroup css={stepRowStyle}>
                            {step.completed && (
                                <>
                                    {isExpanded && (
                                        <EuiButton
                                            onClick={(
                                                event: React.MouseEvent<HTMLButtonElement>,
                                            ) => {
                                                setTableView(!tableView);
                                                event.stopPropagation();
                                            }}
                                            size="s"
                                        >
                                            {t(
                                                tableView
                                                    ? 'jsonView'
                                                    : 'tableView',
                                            )}
                                        </EuiButton>
                                    )}
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
                                                completedAt,
                                            )}
                                        </EuiText>
                                    </EuiFlexItem>
                                    <EuiFlexItem
                                        grow={0}
                                        css={getStepToggleExpandStyle(
                                            hasStepContent,
                                        )}
                                    >
                                        {(isExpanded && (
                                            <WfoChevronUp
                                                color={theme.colors.text}
                                            />
                                        )) || (
                                            <WfoChevronDown
                                                color={theme.colors.text}
                                            />
                                        )}
                                    </EuiFlexItem>
                                </>
                            )}
                        </EuiFlexGroup>
                    </EuiFlexGroup>
                    {hasStepContent &&
                        !hasHtmlMail &&
                        isExpanded &&
                        (tableView ? (
                            <WfoTableCodeBlock stepState={stepContent} />
                        ) : (
                            <WfoJsonCodeBlock data={stepContent} />
                        ))}
                    {isExpanded && hasHtmlMail && (
                        <div css={stepEmailContainerStyle}>
                            {displayMailConfirmation(
                                step.stateDelta.confirmation_mail as EmailState,
                            )}
                        </div>
                    )}
                    {step.status === StepStatus.SUSPEND && userInputForm && (
                        <WfoStepForm
                            userInputForm={userInputForm}
                            isTask={isTask}
                            processId={processId}
                            userPermissions={userPermissions}
                        />
                    )}
                </EuiPanel>
            </div>
        );
    },
);

WfoStep.displayName = 'WfoStep';
