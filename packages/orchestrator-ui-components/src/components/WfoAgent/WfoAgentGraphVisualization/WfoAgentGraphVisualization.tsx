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

        // Convert graph nodes to ReactFlow nodes
        const reactFlowNodes: Node[] = graphStructure.nodes.map((node) => {
            const nodeState = executionState.nodes.get(node.id);
            const isActive = nodeState?.isActive || false;
            const wasVisited = nodeState?.wasVisited || false;

            return {
                id: node.id,
                position: { x: 0, y: 0 },
                data: { label: node.label, graphNode: node },
                type: 'default',
                style: {
                    backgroundColor: isActive
                        ? '#0071c2'
                        : wasVisited
                          ? '#90EE90'
                          : undefined,
                    borderColor: isActive ? '#003d82' : undefined,
                    borderWidth: isActive ? 2 : undefined,
                    color: isActive || wasVisited ? '#fff' : undefined,
                },
            };
        });

        // Add __end__ node if referenced
        const hasEndNode = graphStructure.edges.some((e) => e.target === '__end__');
        if (hasEndNode) {
            reactFlowNodes.push({
                id: '__end__',
                position: { x: 0, y: 0 },
                data: { label: 'End' },
                type: 'output',
            });
        }

        // Convert graph edges to ReactFlow edges
        const reactFlowEdges: Edge[] = graphStructure.edges.map(
            (edge, index) => ({
                id: `edge-${index}`,
                source: edge.source,
                target: edge.target,
                label: edge.label || undefined,
                animated: true,
            }),
        );

        return getLayoutedElements(reactFlowNodes, reactFlowEdges);
    }, [graphStructure, executionState.nodes]);

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
