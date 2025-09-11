import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export const WfoSearchLoadingState: React.FC = () => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiPanel paddingSize="l" color="transparent" hasShadow={false}>
            <EuiFlexGroup justifyContent="center" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiText size="m" color={theme.colors.textSubdued}>
                        Loading search results...
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
