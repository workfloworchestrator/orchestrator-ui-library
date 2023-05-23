import React, { useContext } from 'react';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { HeaderBadge } from '../HeaderBadge/HeaderBadge';
import { OrchestratorConfigContext } from '../../../contexts/OrchestratorConfigContext';
import { Environment } from '../../../hooks/useOrchestratorConfig';

export const EnvironmentBadge = () => {
    const { environmentName } = useContext(OrchestratorConfigContext);
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    if (environmentName !== Environment.PRODUCTION) {
        return (
            <HeaderBadge color="warning" textColor={theme.colors.shadow}>
                {environmentName}
            </HeaderBadge>
        );
    }

    return (
        <HeaderBadge
            color={toSecondaryColor(theme.colors.primary)}
            textColor={theme.colors.primary}
        >
            {environmentName}
        </HeaderBadge>
    );
};
