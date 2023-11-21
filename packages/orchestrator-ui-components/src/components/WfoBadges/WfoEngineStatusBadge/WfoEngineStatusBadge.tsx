import React from 'react';

import { useEngineStatusQuery } from '../../../hooks/useEngineStatusQuery';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoStatusDotIcon } from '../../../icons/WfoStatusDotIcon';
import { WfoHeaderBadge } from '../WfoHeaderBadge';

export const WfoEngineStatusBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data: engineStatus } = useEngineStatusQuery();

    const engineStatusText: string = engineStatus?.global_status
        ? `Engine is ${engineStatus.global_status}`
        : 'Engine status is unavailable';

    const engineColor =
        engineStatus?.global_status === 'RUNNING'
            ? theme.colors.success
            : theme.colors.warning;

    return (
        <WfoHeaderBadge
            color={theme.colors.emptyShade}
            textColor={theme.colors.shadow}
            iconType={() => <WfoStatusDotIcon color={engineColor} />}
        >
            {engineStatusText}
        </WfoHeaderBadge>
    );
};
