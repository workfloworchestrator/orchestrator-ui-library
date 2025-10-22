import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoCheckmarkCircleFill, WfoXCircleFill } from '@/icons';

type ToolProgressProps = {
    name: string;
    status: 'executing' | 'inProgress' | 'complete' | 'failed';
};

export const ToolProgress = ({ name, status }: ToolProgressProps) => {
    const { theme } = useOrchestratorTheme();

    const renderStatus = () => {
        if (status === 'complete') {
            return (
                <WfoCheckmarkCircleFill
                    color={theme.colors.success}
                    width={16}
                    height={16}
                />
            );
        }
        if (status === 'inProgress' || status === 'executing') {
            return <EuiLoadingSpinner size="s" />;
        }
        if (status === 'failed') {
            return (
                <WfoXCircleFill
                    color={theme.colors.danger}
                    width={16}
                    height={16}
                />
            );
        }
        return null;
    };

    return (
        <EuiFlexGroup
            gutterSize="s"
            alignItems="center"
            style={{
                padding: `${theme.size.s} ${theme.size.base}`,
            }}
        >
            <EuiFlexItem grow={true}>
                <span
                    style={{
                        fontSize: theme.size.m,
                        fontWeight: theme.font.weight.medium,
                    }}
                >
                    {name}
                </span>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>{renderStatus()}</EuiFlexItem>
        </EuiFlexGroup>
    );
};
