import React, { ReactNode } from 'react';

import { EuiFlexGroup } from '@elastic/eui';

import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

interface WfoNoResultsProps {
    text: string;
    icon: ReactNode;
}

export const WfoNoResults = ({ text, icon }: WfoNoResultsProps) => {
    const { theme } = useOrchestratorTheme();
    const { panelStyle } = getStyles(theme);

    return (
        <EuiFlexGroup css={panelStyle}>
            {icon} {text}
        </EuiFlexGroup>
    );
};
