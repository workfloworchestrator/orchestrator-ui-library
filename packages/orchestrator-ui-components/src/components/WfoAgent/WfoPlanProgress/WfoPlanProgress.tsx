import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiLoadingSpinner, EuiPanel, EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import type { PlanExecutionState } from '@/hooks/useAgentPlanEvents';
import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import {
    WfoCheckmarkCircleFill,
    WfoChevronDown,
    WfoChevronUp,
    WfoMinusCircleOutline,
} from '@/icons';

import { getWfoPlanProgressStyles } from './styles';

type WfoPlanProgressProps = {
    executionState: PlanExecutionState;
};

export const WfoPlanProgress = ({ executionState }: WfoPlanProgressProps) => {
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
    const t = useTranslations('agent.page.planProgress');
    const { theme } = useOrchestratorTheme();

    const {
        containerStyle,
        headerStyle,
        rowStyle,
        reasoningStyle,
        toolCallsToggleStyle,
        toolCallsListStyle,
        iconSize,
    } = useWithOrchestratorTheme(getWfoPlanProgressStyles);

    if (!executionState.planning && executionState.steps.length === 0) {
        return null;
    }

    const toggleStep = (stepName: string) => {
        setExpandedSteps((prev) => {
            const next = new Set(prev);
            if (next.has(stepName)) {
                next.delete(stepName);
            } else {
                next.add(stepName);
            }
            return next;
        });
    };

    const completedCount = executionState.steps.filter(
        (s) => s.status === 'completed',
    ).length;
    const totalCount = executionState.steps.length;
    const allDone = totalCount > 0 && completedCount === totalCount;

    const headerLabel = executionState.planning
        ? t('planning')
        : allDone
        ? t('completed')
        : t('executing', { completed: completedCount, total: totalCount });

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === 'completed')
            return (
                <WfoCheckmarkCircleFill
                    color={theme.colors.success}
                    width={iconSize}
                    height={iconSize}
                />
            );
        if (status === 'pending')
            return (
                <WfoMinusCircleOutline
                    color={theme.colors.textSubdued}
                    width={iconSize}
                    height={iconSize}
                />
            );
        return <EuiLoadingSpinner size="s" />;
    };

    return (
        <EuiPanel hasBorder paddingSize="s" css={containerStyle}>
            <div css={headerStyle}>
                {allDone ? (
                    <WfoCheckmarkCircleFill
                        color={theme.colors.success}
                        width={iconSize}
                        height={iconSize}
                    />
                ) : (
                    <EuiLoadingSpinner size="s" />
                )}
                <span>{headerLabel}</span>
            </div>
            {executionState.steps.map((step) => {
                const isExpanded = expandedSteps.has(step.step_name);
                const hasToolCalls = step.tool_calls.length > 0;

                return (
                    <div key={step.step_name}>
                        <div css={rowStyle}>
                            <StatusIcon status={step.status} />
                            <EuiText
                                size="s"
                                color={
                                    step.status === 'pending'
                                        ? 'subdued'
                                        : undefined
                                }
                            >
                                {step.step_name}
                            </EuiText>
                            {hasToolCalls && (
                                <span
                                    css={toolCallsToggleStyle}
                                    onClick={() => toggleStep(step.step_name)}
                                >
                                    {step.tool_calls.length}
                                    {isExpanded ? (
                                        <WfoChevronUp
                                            width={iconSize}
                                            height={iconSize}
                                        />
                                    ) : (
                                        <WfoChevronDown
                                            width={iconSize}
                                            height={iconSize}
                                        />
                                    )}
                                </span>
                            )}
                        </div>
                        {step.reasoning && (
                            <EuiText
                                size="xs"
                                color="subdued"
                                css={reasoningStyle}
                            >
                                {step.reasoning}
                            </EuiText>
                        )}
                        {isExpanded && hasToolCalls && (
                            <div css={toolCallsListStyle}>
                                {step.tool_calls.map((tc) => (
                                    <EuiText
                                        size="xs"
                                        key={tc.id}
                                        css={rowStyle}
                                    >
                                        <StatusIcon
                                            status={
                                                tc.status === 'complete'
                                                    ? 'completed'
                                                    : 'active'
                                            }
                                        />
                                        <span>{tc.name}</span>
                                    </EuiText>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </EuiPanel>
    );
};
