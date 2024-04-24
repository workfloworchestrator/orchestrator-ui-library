import React, { ReactNode } from 'react';

import { EuiFlexGroup } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

interface WfoNoResultsProps {
    text: string;
    icon: ReactNode;
}

export const WfoNoResults = ({ text, icon }: WfoNoResultsProps) => {
    const { panelStyle } = useWithOrchestratorTheme(getStyles);

    return (
        <EuiFlexGroup css={panelStyle}>
            {icon} {text}
        </EuiFlexGroup>
    );
};
