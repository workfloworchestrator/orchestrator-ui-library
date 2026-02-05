import React, { useMemo, useState, useCallback } from 'react';

import dagre from '@dagrejs/dagre';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';

import { useGetGraphStructureQuery } from '@/rtk/endpoints/agentGraph';
import { GraphNode, GraphExecutionState } from '@/types/agentGraph';

import { WfoAgentGraphNodePanel } from '../WfoAgentGraphNodePanel';

import '@xyflow/react/dist/style.css';

export interface WfoAgentGraphVisualizationProps {
    executionState: GraphExecutionState;
}

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 150, height: 50 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 75,
                y: nodeWithPosition.y - 25,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export function WfoAgentGraphVisualization({ executionState }: WfoAgentGraphVisualizationProps) {
    const { data: graphStructure, isLoading } = useGetGraphStructureQuery();
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

    const { nodes, edges } = useMemo(() => {
        if (!graphStructure) {
            return { nodes: [], edges: [] };
        }

        const allNodes: Node[] = [];
        const allEdges: Edge[] = [];
        const allVisits = executionState.visits || [];

        // Group visits by "graph layer" - each layer starts with an IntentNode
        // and includes all following nodes until the next IntentNode
        const graphLayers: Array<typeof allVisits> = [];
        let currentLayer: typeof allVisits = [];

        allVisits.forEach((visit, idx) => {
            // Skip End node entirely
            if (visit.nodeId === 'End') {
                return;
            }

            // Check if this is a post-action IntentNode (routes to End)
            if (visit.nodeId === 'IntentNode') {
                const visitsInSameIteration = allVisits.filter(v => v.iterationIndex === visit.iterationIndex);
                const intentNodeVisits = visitsInSameIteration.filter(v => v.nodeId === 'IntentNode');
                const isFirstIntentNode = intentNodeVisits[0]?.visitIndex === visit.visitIndex;

                if (isFirstIntentNode) {
                    // Start a new layer
                    if (currentLayer.length > 0) {
                        graphLayers.push(currentLayer);
                    }
                    currentLayer = [visit];
                }
                // else: post-action IntentNode, skip it
            } else {
                // Action node - add to current layer
                currentLayer.push(visit);
            }
        });

        // Add the last layer
        if (currentLayer.length > 0) {
            graphLayers.push(currentLayer);
        }

        // For each graph layer, create the full graph structure showing all options
        graphLayers.forEach((layerVisits, layerIdx) => {
            // Track which nodes were visited in this layer
            const visitedInLayer = new Set(layerVisits.map(v => v.nodeId));

            // Create all possible nodes for this layer
            graphStructure.nodes.forEach((graphNode) => {
                const instanceId = `${graphNode.id}_layer${layerIdx}`;
                const isVisitedNode = visitedInLayer.has(graphNode.id);

                // Check if this specific node is currently active
                const activeVisit = layerVisits.find(v => v.nodeId === graphNode.id && v.isActive);
                const isActive = !!activeVisit;

                allNodes.push({
                    id: instanceId,
                    position: { x: 0, y: 0 }, // Will be positioned by dagre
                    data: {
                        label: graphNode.label,
                        graphNode,
                        layerIdx,
                    },
                    type: 'default',
                    style: {
                        backgroundColor: isActive
                            ? '#0071c2'
                            : isVisitedNode
                              ? '#90EE90'
                              : '#1a1a1a',
                        borderColor: isActive
                            ? '#003d82'
                            : isVisitedNode
                              ? '#00ff00'
                              : '#404040',
                        borderWidth: isActive ? 2 : 1,
                        color: isVisitedNode ? '#fff' : '#808080',
                        opacity: isVisitedNode ? 1 : 0.4,
                    },
                });
            });

            // Create edges within this layer (show graph structure)
            graphStructure.edges.forEach((edge, edgeIdx) => {
                const sourceInstance = `${edge.source}_layer${layerIdx}`;
                const targetInstance = `${edge.target}_layer${layerIdx}`;

                // Check if this edge is part of the visited path in this layer
                const sourceVisited = visitedInLayer.has(edge.source);
                const targetVisited = visitedInLayer.has(edge.target);

                // Build path within layer
                const layerPath: string[] = [];
                layerVisits.forEach(v => layerPath.push(v.nodeId));

                // Check if this edge connects consecutive nodes in the path
                let isPathEdge = false;
                for (let i = 0; i < layerPath.length - 1; i++) {
                    if (layerPath[i] === edge.source && layerPath[i + 1] === edge.target) {
                        isPathEdge = true;
                        break;
                    }
                }

                allEdges.push({
                    id: `edge-layer${layerIdx}-${edgeIdx}`,
                    source: sourceInstance,
                    target: targetInstance,
                    label: edge.label || undefined,
                    animated: isPathEdge,
                    style: {
                        stroke: isPathEdge ? '#00ff00' : '#404040',
                        strokeWidth: isPathEdge ? 2 : 1,
                        opacity: isPathEdge ? 1 : 0.2,
                    },
                });
            });

            // Create connector edge to next layer (if exists)
            if (layerIdx < graphLayers.length - 1) {
                const nextLayer = graphLayers[layerIdx + 1];
                // Last visited node in current layer
                const lastVisitInLayer = layerVisits[layerVisits.length - 1];
                // First visited node in next layer (should be IntentNode)
                const firstVisitInNextLayer = nextLayer[0];

                if (lastVisitInLayer && firstVisitInNextLayer) {
                    const sourceInstance = `${lastVisitInLayer.nodeId}_layer${layerIdx}`;
                    const targetInstance = `${firstVisitInNextLayer.nodeId}_layer${layerIdx + 1}`;

                    allEdges.push({
                        id: `connector-layer${layerIdx}-to-layer${layerIdx + 1}`,
                        source: sourceInstance,
                        target: targetInstance,
                        animated: true,
                        style: {
                            stroke: '#00ff00',
                            strokeWidth: 2,
                            strokeDasharray: '5,5',
                        },
                    });
                }
            }
        });

        return getLayoutedElements(allNodes, allEdges);
    }, [graphStructure, executionState.visits]);

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        if (node.data.graphNode) {
            setSelectedNode(node.data.graphNode);
        }
    }, []);

    const onPanelClose = useCallback(() => {
        setSelectedNode(null);
    }, []);

    if (isLoading) {
        return <div>Loading graph...</div>;
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
                <Background />
                <Controls />
            </ReactFlow>
            {selectedNode && (
                <WfoAgentGraphNodePanel
                    node={selectedNode}
                    executionState={executionState.nodes.get(selectedNode.id)}
                    isInSelectedPath={executionState.executionPath.includes(
                        selectedNode.id,
                    )}
                    onClose={onPanelClose}
                />
            )}
        </div>
    );
}
