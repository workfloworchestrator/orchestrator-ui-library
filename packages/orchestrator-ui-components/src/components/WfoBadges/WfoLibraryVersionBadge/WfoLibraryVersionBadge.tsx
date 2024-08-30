import React from 'react';

import { EuiText } from '@elastic/eui';

import { ORCHESTRATOR_UI_LIBRARY_VERSION } from '@/configuration';

import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';

export const WfoLibraryVersionBadge = () => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiText
            color={theme.colors.ghost}
            size="xs"
            style={{ display: 'inline-block', marginLeft: theme.base }}
        >
            v{ORCHESTRATOR_UI_LIBRARY_VERSION}
        </EuiText>
    );
};
