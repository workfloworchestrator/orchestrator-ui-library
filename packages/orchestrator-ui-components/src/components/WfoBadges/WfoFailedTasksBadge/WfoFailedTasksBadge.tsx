import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiToolTip } from '@elastic/eui';

import { WfoHeaderBadge } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { WfoCheckmarkCircleFill } from '@/icons';
import { WfoXCircleFill } from '@/icons';
import {
    ProcessStatusCounts,
    useProcessStatusCountsQuery,
} from '@/rtk/endpoints/processStatusCounts';

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
    const t = useTranslations('common');
    const { theme } = useOrchestratorTheme();
    const { data: processStatusCounts } = useProcessStatusCountsQuery();

    const taskCountsSummary = getTaskCountsSummary(processStatusCounts);

    if (taskCountsSummary.total != 0) {
        return (
            <EuiToolTip
                position="bottom"
                content={
                    <>
                        <div>Failed: {taskCountsSummary.failed}</div>
                        <div>
                            Inconsistent data:{' '}
                            {taskCountsSummary.inconsistentData}
                        </div>
                        <div>
                            API unavailable: {taskCountsSummary.apiUnavailable}
                        </div>
                    </>
                }
            >
                <WfoHeaderBadge
                    color={theme.colors.ghost}
                    textColor={theme.colors.shadow}
                    iconType={() => (
                        <WfoXCircleFill color={theme.colors.danger} />
                    )}
                >
                    {taskCountsSummary.total}
                </WfoHeaderBadge>
            </EuiToolTip>
        );
    } else {
        return (
            <EuiToolTip
                position="bottom"
                content={
                    <>
                        <div>{t('noFailedTasks')}</div>
                    </>
                }
            >
                <WfoHeaderBadge
                    color={theme.colors.ghost}
                    textColor={theme.colors.shadow}
                    iconType={() => (
                        <WfoCheckmarkCircleFill color={theme.colors.success} />
                    )}
                >
                    0
                </WfoHeaderBadge>
            </EuiToolTip>
        );
    }
};
