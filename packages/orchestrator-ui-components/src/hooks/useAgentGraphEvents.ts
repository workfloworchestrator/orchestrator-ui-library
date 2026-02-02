import { useEffect, useState } from 'react';

import type { AgentSubscriber } from '@ag-ui/client';
// @ts-ignore - v2 subpath exists but TypeScript moduleResolution doesn't recognize it
import { useAgent } from '@copilotkit/react-core/v2';

import { GraphExecutionState, NodeExecutionState } from '@/types/agentGraph';

export function useAgentGraphEvents(agentId: string = 'query_agent') {
    const { agent } = useAgent({ agentId });
    const [executionState, setExecutionState] = useState<GraphExecutionState>({
        nodes: new Map<string, NodeExecutionState>(),
        executionPath: [],
        currentActiveNode: null,
    });

    useEffect(() => {
        if (!agent) {
            return;
        }

        const subscriber: AgentSubscriber = {
            onCustomEvent: (params) => {
                const event = params?.event;
                if (!event) {
                    return;
                }

                if (event.name === 'GRAPH_NODE_ACTIVE') {
                    const nodeId = event.value?.node;
                    if (!nodeId) return;

                    setExecutionState((prev) => {
                        const newNodes = new Map(prev.nodes);

                        // Mark previous active node as inactive and set its exit time
                        if (prev.currentActiveNode && prev.currentActiveNode !== nodeId) {
                            const prevNode = newNodes.get(prev.currentActiveNode);
                            if (prevNode) {
                                newNodes.set(prev.currentActiveNode, {
                                    ...prevNode,
                                    isActive: false,
                                    exitTime: Date.now(),
                                });
                            }
                        }

                        const existingNode = newNodes.get(nodeId) || {
                            nodeId,
                            isActive: false,
                            wasVisited: false,
                            toolCalls: [],
                        };

                        newNodes.set(nodeId, {
                            ...existingNode,
                            isActive: true,
                            wasVisited: true,
                            enterTime: Date.now(),
                        });

                        const newPath = prev.executionPath.includes(nodeId)
                            ? prev.executionPath
                            : [...prev.executionPath, nodeId];

                        return {
                            nodes: newNodes,
                            executionPath: newPath,
                            currentActiveNode: nodeId,
                        };
                    });
                }
            },
            onToolCallStartEvent: ({ event }) => {
                setExecutionState((prev) => {
                    const currentNode = prev.currentActiveNode;
                    if (!currentNode) return prev;

                    const newNodes = new Map(prev.nodes);
                    const existingNode = newNodes.get(currentNode);
                    if (!existingNode) return prev;

                    newNodes.set(currentNode, {
                        ...existingNode,
                        toolCalls: [
                            ...existingNode.toolCalls,
                            {
                                id: event.toolCallId,
                                name: event.toolCallName,
                                status: 'executing' as const,
                                startTime: event.timestamp ?? Date.now(),
                            },
                        ],
                    });

                    return {
                        ...prev,
                        nodes: newNodes,
                    };
                });
            },
            onToolCallEndEvent: ({ event }) => {
                setExecutionState((prev) => {
                    const currentNode = prev.currentActiveNode;
                    if (!currentNode) return prev;

                    const newNodes = new Map(prev.nodes);
                    const existingNode = newNodes.get(currentNode);
                    if (!existingNode) return prev;

                    const updatedToolCalls = existingNode.toolCalls.map(
                        (toolCall) =>
                            toolCall.id === event.toolCallId
                                ? {
                                      ...toolCall,
                                      status: 'complete' as const,
                                      endTime: event.timestamp ?? Date.now(),
                                  }
                                : toolCall,
                    );

                    newNodes.set(currentNode, {
                        ...existingNode,
                        toolCalls: updatedToolCalls,
                    });

                    return {
                        ...prev,
                        nodes: newNodes,
                    };
                });
            },
            onRunStartedEvent: () => {
                setExecutionState({
                    nodes: new Map(),
                    executionPath: [],
                    currentActiveNode: null,
                });
            },
        };

        const subscription = agent.subscribe(subscriber);

        return () => {
            subscription.unsubscribe();
        };
    }, [agent]);

    return executionState;
}
