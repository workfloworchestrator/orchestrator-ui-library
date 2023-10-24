import React from 'react';
import { EuiToolTip } from '@elastic/eui';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoHeaderBadge } from '../WfoHeaderBadge';
import { WfoXCircleFill } from '../../../icons/WfoXCircleFill';
import {
    ProcessStatusCounts,
    useProcessStatusCountsQuery,
} from '../../../hooks/useProcessStatusCountsQuery';

type TaskCountsSummary = {
    failed: number;
    inconsistentData: number;
    apiUnavailable: number;
    total: number;
};

const getTaskCountsSummary = (
    processStatusCounts?: ProcessStatusCounts,
): TaskCountsSummary => {
    const failed = processStatusCounts?.task_counts.failed || 0;
    const inconsistentData =
        processStatusCounts?.task_counts.inconsistent_data || 0;
    const apiUnavailable =
        processStatusCounts?.task_counts.api_unavailable || 0;
    return {
        failed,
        inconsistentData,
        apiUnavailable,
        total: failed + inconsistentData + apiUnavailable,
    };
};

export const WfoFailedTasksBadge = () => {
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
            <WfoHeaderBadge
                color={theme.colors.emptyShade}
                textColor={theme.colors.shadow}
                iconType={() => <WfoXCircleFill color={theme.colors.danger} />}
            >
                {taskCountsSummary.total}
            </WfoHeaderBadge>
        </EuiToolTip>
    );
};
