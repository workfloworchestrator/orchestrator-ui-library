import React, { useContext } from 'react';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WFOHeaderBadge } from '../WFOHeaderBadge/WFOHeaderBadge';
import { OrchestratorConfigContext } from '../../../contexts/OrchestratorConfigContext';
import { Environment } from '../../../hooks/useOrchestratorConfig';

export const WFOEnvironmentBadge = () => {
    const { environmentName } = useContext(OrchestratorConfigContext);
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    if (environmentName !== Environment.PRODUCTION) {
        return (
            <WFOHeaderBadge color="warning" textColor={theme.colors.shadow}>
                {environmentName}
            </WFOHeaderBadge>
        );
    }

    return (
        <WFOHeaderBadge
            color={toSecondaryColor(theme.colors.primary)}
            textColor={theme.colors.primary}
        >
            {environmentName}
        </WFOHeaderBadge>
    );
};
