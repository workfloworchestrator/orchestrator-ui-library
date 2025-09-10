import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export const WfoSearchEmptyState: React.FC = () => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiPanel paddingSize="l" color="transparent" hasShadow={false}>
            <EuiFlexGroup justifyContent="center" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiText size="m" color={theme.colors.textSubdued}>
                        No results found for your search.
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
