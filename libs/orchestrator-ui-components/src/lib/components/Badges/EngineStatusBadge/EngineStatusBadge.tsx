import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { HeaderBadge } from '../HeaderBadge';
import { useEngineStatusQuery } from '../../../hooks/useEngineStatusQuery';
import { StatusDotIcon } from '../../../icons/StatusDotIcon';

export const EngineStatusBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data: engineStatus } = useEngineStatusQuery();

    const engineStatusText: string = engineStatus?.global_status
        ? `Engine is ${engineStatus.global_status}`
        : 'Engine status is unavailable';

    return (
        <HeaderBadge
            color={theme.colors.emptyShade}
            textColor={theme.colors.shadow}
            iconType={() => <StatusDotIcon color={theme.colors.success} />}
        >
            {engineStatusText}
        </HeaderBadge>
    );
};
