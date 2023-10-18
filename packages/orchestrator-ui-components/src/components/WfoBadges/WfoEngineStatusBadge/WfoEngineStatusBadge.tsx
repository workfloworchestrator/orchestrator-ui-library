import React from 'react';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoHeaderBadge } from '../WfoHeaderBadge';
import { useEngineStatusQuery } from '../../../hooks/useEngineStatusQuery';
import { WfoStatusDotIcon } from '../../../icons/WfoStatusDotIcon';

export const WfoEngineStatusBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data: engineStatus } = useEngineStatusQuery();

    const engineStatusText: string = engineStatus?.global_status
        ? `Engine is ${engineStatus.global_status}`
        : 'Engine status is unavailable';

    // if (engineStatus === engineStatus?.global) {
    //     const engineColor = theme.colors.success
    // } else {
    //     const engineColor = theme.colors.danger
    // }
    //
    // return (
    //     <WfoHeaderBadge
    //         color={theme.colors.emptyShade}
    //         textColor={theme.colors.shadow}
    //         iconType={() => <WFOStatusDotIcon color={engineColor} />}
    //     >
    //         {engineStatusText}
    //     </WfoHeaderBadge>
    // );

    if (engineStatus?.global_status == 'RUNNING') {
        return (
            <WfoHeaderBadge
                color={theme.colors.emptyShade}
                textColor={theme.colors.shadow}
                iconType={() => (
                    <WfoStatusDotIcon color={theme.colors.success} />
                )}
            >
                {engineStatusText}
            </WfoHeaderBadge>
        );
    } else {
        return (
            <WfoHeaderBadge
                color={theme.colors.emptyShade}
                textColor={theme.colors.shadow}
                iconType={() => (
                    <WfoStatusDotIcon color={theme.colors.danger} />
                )}
            >
                {engineStatusText}
            </WfoHeaderBadge>
        );
    }
};
