import React from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoStatusDotIcon } from '@/icons';
import { useGetEngineStatusQuery } from '@/rtk';
import { EngineStatus } from '@/types';

import { WfoHeaderBadge } from '../WfoHeaderBadge';

export const WfoEngineStatusBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data } = useGetEngineStatusQuery();
    const { engineStatus } = data || {};

    const engineStatusText: string = engineStatus
        ? `Engine is ${engineStatus}`
        : 'Engine status is unavailable';

    const engineColor =
        engineStatus === EngineStatus.RUNNING
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
