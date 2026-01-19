import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiToolTip } from '@elastic/eui';

import { WfoScheduledTaskOnce, WfoScheduledTaskRecurring } from '@/icons';

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
    workflowSchedules,
}: {
    workflowSchedules?: string[];
}) => {
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
