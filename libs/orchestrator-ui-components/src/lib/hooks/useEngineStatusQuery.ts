import { useQuery } from 'react-query';
import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';

export type GlobalStatus = 'RUNNING' | 'PAUSED' | 'PAUSING';
export interface EngineStatus {
    global_lock: boolean;
    running_processes: number;
    global_status: GlobalStatus;
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
