import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';

export type GlobalStatus = 'RUNNING' | 'PAUSED' | 'PAUSING';
export interface EngineStatus {
    global_lock: boolean;
    running_processes: number;
    global_status: GlobalStatus;
}

interface EngineStatusPayload {
    global_lock: boolean;
}

export const useEngineStatusQuery = () => {
    const { engineStatusEndpoint } = useContext(OrchestratorConfigContext);

    const fetchEngineStatus = async () => {
        const response = await fetch(engineStatusEndpoint, {
            method: 'GET',
        });
        return (await response.json()) as EngineStatus;
    };

    return useQuery('engineStatus', fetchEngineStatus);
};

export const useEngineStatusMutation = () => {
    const { engineStatusEndpoint } = useContext(OrchestratorConfigContext);
    const queryClient = useQueryClient();

    const setEngineStatus = async (data: EngineStatusPayload) => {
        const response = await fetch(engineStatusEndpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return (await response.json()) as EngineStatus;
    };

    return useMutation('engineStatus', setEngineStatus, {
        onMutate: () => {
            queryClient.setQueryData(['engineStatus'], null); // Set loading state of the button
        },
        onSuccess: (data: EngineStatus) => {
            queryClient.setQueryData(['engineStatus'], data); // Set global status
        },
    });
};
