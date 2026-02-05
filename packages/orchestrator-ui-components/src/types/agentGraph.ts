// Types for agent graph visualization

export interface GraphNode {
    id: string;
    label: string;
    description: string | null;
}

export interface GraphEdge {
    source: string;
    target: string;
    label: string | null;
}

export interface GraphStructure {
    nodes: GraphNode[];
    edges: GraphEdge[];
    start_node: string;
}

// Event types from the SSE stream
export interface GraphNodeActiveEvent {
    type: 'CUSTOM';
    name: 'GRAPH_NODE_ACTIVE';
    timestamp: number;
    value: {
        node: string;
        step_type: string;
    };
}

export interface ToolCallStartEvent {
    type: 'TOOL_CALL_START';
    timestamp: number;
    toolCallId: string;
    toolCallName: string;
    parentMessageId: string;
}

export interface ToolCallEndEvent {
    type: 'TOOL_CALL_END';
    timestamp: number;
    toolCallId: string;
}

export interface RunErrorEvent {
    type: 'RUN_ERROR';
    timestamp: number;
    message: string;
}

export type AgentStreamEvent =
    | GraphNodeActiveEvent
    | ToolCallStartEvent
    | ToolCallEndEvent
    | RunErrorEvent;

// Execution state
export interface ToolCall {
    id: string;
    name: string;
    status: 'executing' | 'complete' | 'failed';
    startTime: number;
    endTime?: number;
}

export interface NodeExecutionState {
    nodeId: string;
    isActive: boolean;
    wasVisited: boolean;
    toolCalls: ToolCall[];
    enterTime?: number;
    exitTime?: number;
}

export interface NodeVisit {
    nodeId: string; // Original node ID from graph structure
    visitIndex: number; // Sequential visit number (0, 1, 2...)
    iterationIndex: number; // Which graph iteration (0, 1, 2...)
    timestamp: number;
    isActive: boolean;
}

export interface GraphIteration {
    index: number;
    visitedNodeIds: Set<string>; // Which nodes were visited in this iteration
    isActive: boolean; // Is this the current iteration
}

export interface GraphExecutionState {
    nodes: Map<string, NodeExecutionState>;
    executionPath: string[];
    currentActiveNode: string | null;
    // New: track visits for duplication
    visits: NodeVisit[];
    iterations: GraphIteration[];
    currentIterationIndex: number;
}
