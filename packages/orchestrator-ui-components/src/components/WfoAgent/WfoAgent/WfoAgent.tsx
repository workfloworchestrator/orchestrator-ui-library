import React, { useCallback, useRef } from 'react';

import { useTranslations } from 'next-intl';

import { useRenderToolCall } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import type { RenderMessageProps } from '@copilotkit/react-ui';

import { WfoAvailabilityCheck } from '@/components/WfoAvailabilityCheck';
import { getPageTemplateStyles } from '@/components/WfoPageTemplate/WfoPageTemplate/styles';
import { useWithOrchestratorTheme } from '@/hooks';
import {
    type PlanExecutionState,
    useAgentPlanEvents,
} from '@/hooks/useAgentPlanEvents';
import { useAgentAvailability } from '@/hooks/useBackendAvailability';
import { ExportArtifact, QueryArtifact } from '@/types';

import { ExportButton } from '../ExportButton';
import { WfoPlanProgress } from '../WfoPlanProgress';
import { WfoQueryArtifact } from '../WfoQueryArtifact';

export function WfoAgent() {
    const tPage = useTranslations('agent.page');

    const { NAVIGATION_HEIGHT } = useWithOrchestratorTheme(
        getPageTemplateStyles,
    );
    const agentAvailability = useAgentAvailability();
    const planProgress = useAgentPlanEvents();

    // Use a ref so the RenderMessage callback stays stable (no blink)
    // while always reading the latest plan progress
    const planProgressRef = useRef<PlanExecutionState>(planProgress);
    planProgressRef.current = planProgress;

    const RenderMessage = useCallback(
        ({
            message,
            messages,
            inProgress,
            index,
            isCurrentMessage,
            AssistantMessage,
            UserMessage,
            ImageRenderer,
            onRegenerate,
            ...rest
        }: RenderMessageProps) => {
            if (message.role === 'user') {
                return UserMessage ? (
                    <UserMessage
                        key={index}
                        rawData={message}
                        message={message}
                        ImageRenderer={ImageRenderer!}
                    />
                ) : null;
            }

            if (message.role === 'assistant') {
                const progress = planProgressRef.current;

                // Show plan progress on the first assistant message
                // after the last user message (the active response)
                const lastUserIndex = [...messages]
                    .reverse()
                    .findIndex((m) => m.role === 'user');
                const firstAssistantAfterUser =
                    lastUserIndex >= 0 ? messages.length - lastUserIndex : -1;
                const showPlanProgress =
                    index === firstAssistantAfterUser &&
                    (progress.planning || progress.steps.length > 0);

                return (
                    <>
                        {showPlanProgress && (
                            <WfoPlanProgress executionState={progress} />
                        )}
                        {AssistantMessage && (
                            <AssistantMessage
                                key={index}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generativeUI is an internal CopilotKit property not in public types
                                subComponent={(message as any).generativeUI?.()}
                                rawData={message}
                                message={message}
                                messages={messages}
                                isLoading={
                                    inProgress &&
                                    isCurrentMessage &&
                                    !message.content
                                }
                                isGenerating={
                                    inProgress &&
                                    isCurrentMessage &&
                                    !!message.content
                                }
                                isCurrentMessage={isCurrentMessage}
                                onRegenerate={() => onRegenerate?.(message.id)}
                                feedback={
                                    rest.messageFeedback?.[message.id] || null
                                }
                                ImageRenderer={ImageRenderer!}
                                {...rest}
                            />
                        )}
                    </>
                );
            }

            return null;
        },
        [],
    );

    const renderQueryResult = ({ result }: { result?: unknown }) => {
        if (!result) {
            return <></>;
        }
        return <WfoQueryArtifact artifact={result as QueryArtifact} />;
    };

    useRenderToolCall({ name: 'run_search', render: renderQueryResult });
    useRenderToolCall({ name: 'run_aggregation', render: renderQueryResult });

    useRenderToolCall({
        name: 'prepare_export',
        render: ({ result }) => {
            if (!result) {
                return <></>;
            }
            return <ExportButton artifact={result as ExportArtifact} />;
        },
    });

    return (
        <WfoAvailabilityCheck
            featureType="agent"
            availability={agentAvailability}
        >
            <div style={{ height: `calc(90vh - ${NAVIGATION_HEIGHT}px)` }}>
                <style>{`
                .copilotKitChat {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
                <CopilotChat
                    RenderMessage={RenderMessage}
                    labels={{
                        title: tPage('copilot.title'),
                        initial: tPage('copilot.initial'),
                    }}
                    suggestions={[
                        {
                            title: tPage('suggestions.findActiveSubscriptions'),
                            message: tPage(
                                'suggestions.findActiveSubscriptions',
                            ),
                        },
                        {
                            title: tPage('suggestions.showTerminatedWorkflows'),
                            message: tPage(
                                'suggestions.showTerminatedWorkflows',
                            ),
                        },
                        {
                            title: tPage(
                                'suggestions.listAllSubscriptionsAndExport',
                            ),
                            message: tPage(
                                'suggestions.listAllSubscriptionsAndExport',
                            ),
                        },
                        {
                            title: tPage(
                                'suggestions.showActiveSubscriptionsPerMonth',
                            ),
                            message: tPage(
                                'suggestions.showActiveSubscriptionsPerMonth',
                            ),
                        },
                    ]}
                />
            </div>
        </WfoAvailabilityCheck>
    );
}
