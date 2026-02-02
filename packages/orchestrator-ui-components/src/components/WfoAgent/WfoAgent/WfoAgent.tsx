import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useRenderToolCall } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { EuiTab, EuiTabs } from '@elastic/eui';

import { WfoAvailabilityCheck } from '@/components/WfoAvailabilityCheck';
import { getPageTemplateStyles } from '@/components/WfoPageTemplate/WfoPageTemplate/styles';
import { useWithOrchestratorTheme } from '@/hooks';
import { useAgentGraphEvents } from '@/hooks/useAgentGraphEvents';
import { useAgentAvailability } from '@/hooks/useBackendAvailability';
import { AggregationResultsData } from '@/types';

import { ExportButton, ExportData } from '../ExportButton';
import { ToolProgress } from '../ToolProgress';
import { WfoAgentGraphVisualization } from '../WfoAgentGraphVisualization';
import { WfoAgentVisualization } from '../WfoAgentVisualization';

type AgentTab = 'chat' | 'graph';

export function WfoAgent() {
    const tPage = useTranslations('agent.page');
    const [selectedTab, setSelectedTab] = useState<AgentTab>('chat');
    const executionState = useAgentGraphEvents();

    const { NAVIGATION_HEIGHT } = useWithOrchestratorTheme(
        getPageTemplateStyles,
    );
    const agentAvailability = useAgentAvailability();

    useRenderToolCall({
        name: 'run_search',
        render: ({ result }) => {
            if (!result) {
                return <></>;
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
                return <></>;
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
                return <></>;
            }
            return <ExportButton exportData={result as ExportData} />;
        },
    });

    return (
        <WfoAvailabilityCheck
            featureType="agent"
            availability={agentAvailability}
        >
            <div
                style={{
                    height: `calc(90vh - ${NAVIGATION_HEIGHT}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <style>{`
                .copilotKitChat {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
                <EuiTabs>
                    <EuiTab
                        onClick={() => setSelectedTab('chat')}
                        isSelected={selectedTab === 'chat'}
                    >
                        Chat
                    </EuiTab>
                    <EuiTab
                        onClick={() => setSelectedTab('graph')}
                        isSelected={selectedTab === 'graph'}
                    >
                        Graph
                    </EuiTab>
                </EuiTabs>
                <div
                    style={{
                        flex: '1 1 auto',
                        minHeight: 0,
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            display: selectedTab === 'chat' ? 'block' : 'none',
                        }}
                    >
                        <CopilotChat
                            labels={{
                                title: tPage('copilot.title'),
                                initial: tPage('copilot.initial'),
                            }}
                            suggestions={[
                                {
                                    title: tPage(
                                        'suggestions.findActiveSubscriptions',
                                    ),
                                    message: tPage(
                                        'suggestions.findActiveSubscriptions',
                                    ),
                                },
                                {
                                    title: tPage(
                                        'suggestions.showTerminatedWorkflows',
                                    ),
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
                    <div
                        style={{
                            height: '100%',
                            overflow: 'auto',
                            display: selectedTab === 'graph' ? 'block' : 'none',
                        }}
                    >
                        <WfoAgentGraphVisualization
                            executionState={executionState}
                        />
                    </div>
                </div>
            </div>
        </WfoAvailabilityCheck>
    );
}
