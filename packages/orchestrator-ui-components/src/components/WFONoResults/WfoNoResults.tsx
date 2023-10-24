import React, { ReactNode } from 'react';
import { getStyles } from './styles';
import { EuiFlexGroup } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks';

interface WFONoResultsProps {
    text: string;
    icon: ReactNode;
}

export const WFONoResults = ({ text, icon }: WFONoResultsProps) => {
    const { theme } = useOrchestratorTheme();
    const { panelStyle } = getStyles(theme);

    return (
        <EuiFlexGroup css={panelStyle}>
            {icon} {text}
        </EuiFlexGroup>
    );
};
