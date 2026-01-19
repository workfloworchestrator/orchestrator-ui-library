import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiToolTip } from '@elastic/eui';

import { WfoError } from '@/components/WfoError';
import { WfoLoading } from '@/components/WfoLoading';
import { useGetSchedulesForWorkflow } from '@/hooks';
import { WfoScheduledTaskOnce, WfoScheduledTaskRecurring } from '@/icons';
import { ScheduledTaskDefinition } from '@/types';

const WfoWorkflowScheduleIcon = ({
    workflowSchedule,
}: {
    workflowSchedule: string;
}) => {
    if (workflowSchedule.includes('date[')) {
        return <WfoScheduledTaskOnce />;
    }
    return <WfoScheduledTaskRecurring />;
};

export const WfoScheduledTasksBadges = ({
    workflowId,
}: {
    workflowId: ScheduledTaskDefinition['workflowId'];
}) => {
    const { workflowSchedules, isFetching, isError } =
        useGetSchedulesForWorkflow(workflowId);

    if (isFetching) {
        return <WfoLoading />;
    }

    if (isError) {
        return <WfoError />;
    }

    return (
        <EuiFlexGroup gutterSize="s" justifyContent="flexStart">
            {workflowSchedules?.map((workflowSchedule) => {
                return (
                    <EuiFlexItem grow={0}>
                        <EuiToolTip content={workflowSchedule}>
                            <WfoWorkflowScheduleIcon
                                workflowSchedule={workflowSchedule}
                                key={workflowSchedule}
                            />
                        </EuiToolTip>
                    </EuiFlexItem>
                );
            })}
        </EuiFlexGroup>
    );
};
