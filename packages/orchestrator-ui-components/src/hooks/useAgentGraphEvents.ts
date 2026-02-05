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
        visits: [],
        iterations: [{ index: 0, visitedNodeIds: new Set(), isActive: true }],
        currentIterationIndex: 0,
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
                        const timestamp = Date.now();

                        // Mark previous active node as inactive and set its exit time
                        if (prev.currentActiveNode && prev.currentActiveNode !== nodeId) {
                            const prevNode = newNodes.get(prev.currentActiveNode);
                            if (prevNode) {
                                newNodes.set(prev.currentActiveNode, {
                                    ...prevNode,
                                    isActive: false,
                                    exitTime: timestamp,
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
                            enterTime: timestamp,
                        });

                        const newPath = prev.executionPath.includes(nodeId)
                            ? prev.executionPath
                            : [...prev.executionPath, nodeId];

                        // Cycle detection: Check if this node was already visited in the current iteration
                        const currentIteration = prev.iterations[prev.currentIterationIndex];
                        const nodeAlreadyVisitedInIteration = currentIteration.visitedNodeIds.has(nodeId);

                        let newIterations = [...prev.iterations];
                        let currentIterationIndex = prev.currentIterationIndex;

                        // Determine if this is a meaningful cycle (should start new iteration)
                        // Only create new iteration if:
                        // 1. Node was already visited in this iteration AND
                        // 2. This is NOT a post-action IntentNode (routing to End)
                        const isPostActionIntentNode = nodeId === 'IntentNode' &&
                            currentIteration.visitedNodeIds.size > 1; // Already has action nodes

                        if (nodeAlreadyVisitedInIteration && !isPostActionIntentNode) {
                            // Start a new iteration (meaningful cycle detected)
                            const newIterationIndex = prev.currentIterationIndex + 1;

                            // Mark current iteration as inactive
                            newIterations[currentIterationIndex] = {
                                ...currentIteration,
                                isActive: false,
                            };

                            // Create new iteration
                            newIterations.push({
                                index: newIterationIndex,
                                visitedNodeIds: new Set([nodeId]),
                                isActive: true,
                            });

                            currentIterationIndex = newIterationIndex;
                        } else {
                            // Update current iteration with this node visit
                            const updatedVisitedNodes = new Set(currentIteration.visitedNodeIds);
                            updatedVisitedNodes.add(nodeId);

                            newIterations[currentIterationIndex] = {
                                ...currentIteration,
                                visitedNodeIds: updatedVisitedNodes,
                            };
                        }

                        // Add visit to tracking
                        const newVisits = [
                            ...prev.visits,
                            {
                                nodeId,
                                visitIndex: prev.visits.length,
                                iterationIndex: currentIterationIndex,
                                timestamp,
                                isActive: true,
                            },
                        ];

                        // Mark previous visit as inactive
                        if (prev.visits.length > 0) {
                            newVisits[prev.visits.length - 1] = {
                                ...newVisits[prev.visits.length - 1],
                                isActive: false,
                            };
                        }

                        return {
                            nodes: newNodes,
                            executionPath: newPath,
                            currentActiveNode: nodeId,
                            visits: newVisits,
                            iterations: newIterations,
                            currentIterationIndex,
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
                setExecutionState((prev) => {
                    // Check if this is a new conversation turn (not the first run)
                    const hasExistingIterations = prev.iterations.length > 0 && prev.visits.length > 0;

                    if (hasExistingIterations) {
                        // Multi-turn: Create a new iteration but keep previous ones
                        const newIterationIndex = prev.iterations.length;

                        // Mark previous iteration as inactive
                        const updatedIterations = prev.iterations.map((iter, idx) =>
                            idx === prev.currentIterationIndex
                                ? { ...iter, isActive: false }
                                : iter
                        );

                        // Add new iteration
                        updatedIterations.push({
                            index: newIterationIndex,
                            visitedNodeIds: new Set(),
                            isActive: true,
                        });

                        return {
                            nodes: new Map(),
                            executionPath: [],
                            currentActiveNode: null,
                            visits: prev.visits, // Keep previous visits for history
                            iterations: updatedIterations,
                            currentIterationIndex: newIterationIndex,
                        };
                    } else {
                        // First run: Reset everything
                        return {
                            nodes: new Map(),
                            executionPath: [],
                            currentActiveNode: null,
                            visits: [],
                            iterations: [{ index: 0, visitedNodeIds: new Set(), isActive: true }],
                            currentIterationIndex: 0,
                        };
                    }
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
