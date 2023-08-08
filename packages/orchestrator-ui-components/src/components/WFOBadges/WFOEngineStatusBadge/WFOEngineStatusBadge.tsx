import React from 'react';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WFOHeaderBadge } from '../WFOHeaderBadge';
import { useEngineStatusQuery } from '../../../hooks/useEngineStatusQuery';
import { WFOStatusDotIcon } from '../../../icons/WFOStatusDotIcon';

export const WFOEngineStatusBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data: engineStatus } = useEngineStatusQuery();

    const engineStatusText: string = engineStatus?.global_status
        ? `Engine is ${engineStatus.global_status}`
        : 'Engine status is unavailable';

    return (
        <WFOHeaderBadge
            color={theme.colors.emptyShade}
            textColor={theme.colors.shadow}
            iconType={() => <WFOStatusDotIcon color={theme.colors.success} />}
        >
            {engineStatusText}
        </WFOHeaderBadge>
    );
};
