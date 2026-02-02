import React from 'react';

import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { ToolCall } from '@/types/agentGraph';

interface WfoAgentGraphToolCallProps {
    toolCall: ToolCall;
}

export function WfoAgentGraphToolCall({ toolCall }: WfoAgentGraphToolCallProps) {
    const { theme } = useOrchestratorTheme();

    const getStatusColor = (status: ToolCall['status']) => {
        switch (status) {
            case 'executing':
                return 'primary';
            case 'complete':
                return 'success';
            case 'failed':
                return 'danger';
            default:
                return 'default';
        }
    };

    const getDuration = () => {
        if (!toolCall.endTime) {
            return 'In progress...';
        }
        const duration = toolCall.endTime - toolCall.startTime;
        return `${(duration / 1000).toFixed(2)}s`;
    };

    return (
        <div
            style={{
                padding: theme.size.s,
                marginBottom: theme.size.s,
                border: `1px solid ${theme.colors.lightShade}`,
                borderRadius: theme.border.radius.medium,
            }}
        >
            <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiText size="s">
                        <strong>{toolCall.name}</strong>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiBadge color={getStatusColor(toolCall.status)}>
                        {toolCall.status}
                    </EuiBadge>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiText
                size="xs"
                style={{
                    marginTop: theme.size.xs,
                    color: theme.colors.textSubdued,
                }}
            >
                {getDuration()}
            </EuiText>
        </div>
    );
}
