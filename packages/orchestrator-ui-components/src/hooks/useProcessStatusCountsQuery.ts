import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { useQuery } from 'react-query';
import { ProcessStatus } from '../types';

export type ProcessStatusCounts = {
    process_counts: Record<ProcessStatus, number>;
    task_counts: Record<ProcessStatus, number>;
};

export const useProcessStatusCountsQuery = () => {
    const { processStatusCountsEndpoint } = useContext(
        OrchestratorConfigContext,
    );

    const fetchProcessStatusCounts = async () => {
        const response = await fetch(processStatusCountsEndpoint, {
            method: 'GET',
        });
        return (await response.json()) as ProcessStatusCounts;
    };

    return useQuery('processStatusCounts', fetchProcessStatusCounts);
};
