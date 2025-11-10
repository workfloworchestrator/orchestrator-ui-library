import React from 'react';

import { useTranslations } from 'next-intl';

import {
    CatchAllActionRenderProps,
    useCopilotAction,
    useRenderToolCall,
} from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';

import { WfoAvailabilityCheck } from '@/components/WfoAvailabilityCheck';
import { getPageTemplateStyles } from '@/components/WfoPageTemplate/WfoPageTemplate/styles';
import { useWithOrchestratorTheme } from '@/hooks';
import { useAgentAvailability } from '@/hooks/useBackendAvailability';
import { AggregationResultsData } from '@/types';

import { ExportButton, ExportData } from '../ExportButton';
import { ToolProgress } from '../ToolProgress';
import { WfoAgentVisualization } from '../WfoAgentVisualization';

export function WfoAgent() {
    const tPage = useTranslations('agent.page');

    const { NAVIGATION_HEIGHT } = useWithOrchestratorTheme(
        getPageTemplateStyles,
    );
    const agentAvailability = useAgentAvailability();

    useRenderToolCall({
        name: 'run_search',
        render: ({ result }) => {
            if (!result) {
                return '';
            }
            return (
                <WfoAgentVisualization
                    aggregationData={result as AggregationResultsData}
                />
            );
        },
    });

    useRenderToolCall({
        name: 'run_aggregation',
        render: ({ result }) => {
            if (!result) {
                return '';
            }
            return (
                <WfoAgentVisualization
                    aggregationData={result as AggregationResultsData}
                />
            );
        },
    });

    useRenderToolCall({
        name: 'prepare_export',
        render: ({ result }) => {
            if (!result) {
                return '';
            }
            return <ExportButton exportData={result as ExportData} />;
        },
    });

    // Automatically render all other tool calls
    useCopilotAction({
        name: '*',
        render: ({
            name,
            status,
            args,
            result,
        }: CatchAllActionRenderProps<[]>) => {
            return (
                <ToolProgress
                    name={name}
                    status={status}
                    args={args}
                    result={result}
                />
            );
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
