import { useQuery } from 'react-query';
import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { Nullable } from '../types';

interface Process {
    workflow: string;
    pid: string;
    is_task: boolean;
    created_by: Nullable<string>;
    failed_reason: Nullable<string>;
    started_at: number;
    last_status: 'completed' | 'aborted';
    assignee: 'NOC' | 'SYSTEM' | 'CHANGES' | 'USER';
    last_modified_at: number;
    traceback: Nullable<string>;
    last_step: Nullable<string>;
}

export interface SubscriptionProcess {
    workflow_target: null | 'CREATE' | 'MODIFY' | 'TERMINATE' | 'SYSTEM';
    subscription_id: string;
    id: string;
    pid: string;
    created_at: number;
    process: Process;
}

export const useSubscriptionProcesses = (subscriptionId: string) => {
    const { subscriptionProcessesEndpoint } = useContext(
        OrchestratorConfigContext,
    );
    //https://orchestrator.dev.automation.surf.net/api/processes/process-subscriptions-by-subscription-id/d32ecaa5-4e36-448c-a594-0bb6a1b5faf8
    const fetchSubscriptionProcesses = async () => {
        const response = await fetch(
            `${subscriptionProcessesEndpoint}/${subscriptionId}`,
            {
                method: 'GET',
            },
        );
        return (await response.json()) as SubscriptionProcess[];
    };
    return useQuery('subscriptionProcesses', fetchSubscriptionProcesses);
};
