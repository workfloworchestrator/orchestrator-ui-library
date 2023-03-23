import React, { FC, ReactElement, useContext } from 'react';
import {
    EuiBadgeGroup,
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiToolTip,
    EuiText,
} from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { HeaderBadge } from './HeaderBadge';
import { StatusDotIcon } from '../../icons/StatusDotIcon';
import { XCircleFill } from '../../icons/XCircleFill';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { useEngineStatusQuery } from '../../hooks/useEngineStatusQuery';
import {
    ProcessStatusCounts,
    useProcessStatusCountsQuery,
} from '../../hooks/useProcessStatusCountsQuery';
import { OrchestratorConfigContext } from '../../contexts/OrchestratorConfigContext';
import { Environment } from '../../hooks/useOrchestratorConfig';

export interface OrchestratorPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleLogoutClick: () => void;
}

type TaskCountsSummary = {
    failed: number;
    inconsistentData: number;
    apiUnavailable: number;
    total: number;
};

const getTaskCountsSummary = (
    processStatusCounts?: ProcessStatusCounts,
): TaskCountsSummary => {
    const failed = processStatusCounts?.task_counts.failed ?? 0;
    const inconsistentData =
        processStatusCounts?.task_counts.inconsistent_data ?? 0;
    const apiUnavailable =
        processStatusCounts?.task_counts.api_unavailable ?? 0;
    return {
        failed,
        inconsistentData,
        apiUnavailable,
        total: failed + inconsistentData + apiUnavailable,
    };
};

export const OrchestratorPageHeader: FC<OrchestratorPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    handleLogoutClick,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();

    return (
        <EuiHeader
            css={{
                backgroundColor: theme.colors.primary,
                height: navigationHeight,
            }}
        >
            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiHeaderLogo
                        iconType={() => getAppLogo(navigationHeight)}
                    />
                </EuiHeaderSectionItem>
                <EuiHeaderSectionItem>
                    <EnvironmentBadge />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(2) }}>
                        <EngineStatusBadge />
                        <FailedTasksBadge />
                    </EuiBadgeGroup>

                    <EuiButtonIcon
                        aria-label="Logout"
                        display="empty"
                        iconType={() => (
                            <LogoutIcon color={theme.colors.emptyShade} />
                        )}
                        css={{ width: 48, height: 48 }}
                        color="ghost"
                        onClick={() => handleLogoutClick()}
                    />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};

export const EnvironmentBadge = () => {
    const { environmentName } = useContext(OrchestratorConfigContext);
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    if (environmentName !== Environment.PRODUCTION) {
        return (
            <HeaderBadge color="warning">
                <EuiText size="xs">
                    <b>{environmentName}</b>
                </EuiText>
            </HeaderBadge>
        );
    }

    return (
        <HeaderBadge customColor color={toSecondaryColor(theme.colors.primary)}>
            <EuiText color={theme.colors.primary} size="xs">
                <b>{environmentName}</b>
            </EuiText>
        </HeaderBadge>
    );
};

export const EngineStatusBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data: engineStatus } = useEngineStatusQuery();

    const engineStatusText: string = engineStatus?.global_status
        ? `Engine is ${engineStatus.global_status}`
        : 'Engine status is unavailable';

    return (
        <HeaderBadge
            color="emptyShade"
            iconType={() => <StatusDotIcon color={theme.colors.success} />}
        >
            <EuiText size="xs">
                <b>{engineStatusText}</b>
            </EuiText>
        </HeaderBadge>
    );
};

export const FailedTasksBadge = () => {
    const { theme } = useOrchestratorTheme();
    const { data: processStatusCounts } = useProcessStatusCountsQuery();
    const taskCountsSummary = getTaskCountsSummary(processStatusCounts);

    return (
        <EuiToolTip
            position="bottom"
            content={
                <>
                    <div>Failed: {taskCountsSummary.failed}</div>
                    <div>
                        Inconsistent data: {taskCountsSummary.inconsistentData}
                    </div>
                    <div>
                        API unavailable: {taskCountsSummary.apiUnavailable}
                    </div>
                </>
            }
        >
            <HeaderBadge
                color="emptyShade"
                iconType={() => <XCircleFill color={theme.colors.danger} />}
            >
                <EuiText size="xs">
                    <b>{taskCountsSummary.total}</b>
                </EuiText>
            </HeaderBadge>
        </EuiToolTip>
    );
};
