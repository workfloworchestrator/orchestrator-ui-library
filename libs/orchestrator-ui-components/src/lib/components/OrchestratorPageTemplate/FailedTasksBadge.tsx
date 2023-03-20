import React, { FC } from 'react';
import { HeaderBadge } from './HeaderBadge';
import { XCircleFill } from '../../icons/XCircleFill';
import { EuiToolTip } from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';

export type TaskCountsSummary = {
    failed: number;
    inconsistentData: number;
    apiUnavailable: number;
    total: number;
};

export type FailedTasksBadgeProps = {
    taskCountsSummary: TaskCountsSummary;
};

export const FailedTasksBadge: FC<FailedTasksBadgeProps> = ({
    taskCountsSummary,
}) => {
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
