import React, { useContext } from 'react';

import { Environment } from '@/types';

import { OrchestratorConfigContext } from '../../../contexts/OrchestratorConfigContext';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoHeaderBadge } from '../WfoHeaderBadge/WfoHeaderBadge';

export const WfoEnvironmentBadge = () => {
    const { environmentName } = useContext(OrchestratorConfigContext);
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    if (environmentName !== Environment.PRODUCTION) {
        return (
            <WfoHeaderBadge color="warning" textColor={theme.colors.shadow}>
                {environmentName}
            </WfoHeaderBadge>
        );
    }

    return (
        <WfoHeaderBadge
            color={toSecondaryColor(theme.colors.primary)}
            textColor={theme.colors.primary}
        >
            {environmentName}
        </WfoHeaderBadge>
    );
};
