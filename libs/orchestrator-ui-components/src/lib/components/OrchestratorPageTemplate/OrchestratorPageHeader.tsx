import React, { FC, ReactElement } from 'react';
import {
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSectionItem,
    EuiHeaderSection,
    EuiBadgeGroup,
    EuiToolTip,
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
    const { data: engineStatus } = useEngineStatusQuery();
    const { data: processStatusCounts } = useProcessStatusCountsQuery();

    const taskCountsSummary = getTaskCountsSummary(processStatusCounts);

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
                    <HeaderBadge color="warning">Development</HeaderBadge>
                </EuiHeaderSectionItem>
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(2) }}>
                        <HeaderBadge
                            color="emptyShade"
                            iconType={() => (
                                <StatusDotIcon color={theme.colors.success} />
                            )}
                        >
                            Engine is {engineStatus?.global_status}
                        </HeaderBadge>
                        <FailedTasksBadge {...taskCountsSummary} />
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

const FailedTasksBadge = (taskCountsSummary: TaskCountsSummary) => {
    const { theme } = useOrchestratorTheme();

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
                {taskCountsSummary.total}
            </HeaderBadge>
        </EuiToolTip>
    );
};
