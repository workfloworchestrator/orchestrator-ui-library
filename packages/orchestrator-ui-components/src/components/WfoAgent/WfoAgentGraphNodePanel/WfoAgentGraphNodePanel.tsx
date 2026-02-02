import React from 'react';

import {
    EuiBadge,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
    EuiTitle,
} from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoShare } from '@/icons';
import { GraphNode, NodeExecutionState, ToolCall } from '@/types/agentGraph';

import { WfoAgentGraphToolCall } from './WfoAgentGraphToolCall';
import { getGraphNodePanelStyles } from './styles';

interface WfoAgentGraphNodePanelProps {
    node: GraphNode;
    executionState: NodeExecutionState | undefined;
    isInSelectedPath: boolean;
    onClose: () => void;
}

export function WfoAgentGraphNodePanel({
    node,
    executionState,
    isInSelectedPath,
    onClose,
}: WfoAgentGraphNodePanelProps) {
    const { multiplyByBaseUnit, theme } = useOrchestratorTheme();
    const {
        panelStyles,
        headerStyles,
        closeButtonStyles,
        sectionTitleStyles,
        sectionContentStyles,
        toolCallListStyles,
    } = useWithOrchestratorTheme(getGraphNodePanelStyles);

    const toolCalls: ToolCall[] = executionState?.toolCalls ?? [];

    return (
        <div css={panelStyles}>
            <div css={closeButtonStyles}>
                <EuiButtonIcon
                    iconType="cross"
                    aria-label="Close panel"
                    onClick={onClose}
                    color="text"
                />
            </div>

            <div css={headerStyles}>
                <EuiFlexGroup gutterSize="s" alignItems="center">
                    <EuiFlexItem grow={false}>
                        <WfoShare
                            width={multiplyByBaseUnit(1.25)}
                            height={multiplyByBaseUnit(1.25)}
                        />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiTitle size="xs">
                            <h3>{node.label}</h3>
                        </EuiTitle>
                    </EuiFlexItem>
                </EuiFlexGroup>

                {isInSelectedPath && (
                    <EuiBadge
                        color="success"
                        style={{
                            marginTop: theme.size.s,
                            backgroundColor: theme.colors.success,
                            color: theme.colors.fullShade,
                        }}
                    >
                        Selected Path
                    </EuiBadge>
                )}
            </div>

            {node.description && (
                <div>
                    <EuiText css={sectionTitleStyles}>DESCRIPTION</EuiText>
                    <div css={sectionContentStyles}>
                        <EuiText size="s">{node.description}</EuiText>
                    </div>
                </div>
            )}

            <div>
                <EuiText css={sectionTitleStyles}>METADATA</EuiText>
                <div css={sectionContentStyles}>
                    <EuiText size="s">
                        <strong>ID:</strong> {node.id}
                    </EuiText>
                    {executionState?.enterTime && (
                        <EuiText
                            size="xs"
                            style={{
                                marginTop: theme.size.xs,
                                color: theme.colors.textSubdued,
                            }}
                        >
                            Entered:{' '}
                            {new Date(
                                executionState.enterTime,
                            ).toLocaleTimeString()}
                        </EuiText>
                    )}
                    {executionState?.exitTime && (
                        <EuiText
                            size="xs"
                            style={{
                                marginTop: theme.size.xxs,
                                color: theme.colors.textSubdued,
                            }}
                        >
                            Exited:{' '}
                            {new Date(
                                executionState.exitTime,
                            ).toLocaleTimeString()}
                        </EuiText>
                    )}
                </div>
            </div>

            {toolCalls.length > 0 && (
                <div>
                    <EuiText css={sectionTitleStyles}>TOOL CALLS</EuiText>
                    <div css={toolCallListStyles}>
                        {toolCalls.map((toolCall) => (
                            <WfoAgentGraphToolCall
                                key={toolCall.id}
                                toolCall={toolCall}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
