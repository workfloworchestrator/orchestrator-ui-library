import { useContext } from 'react';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { ProcessStatus } from '../types';
import { useQueryWithFetch } from './useQueryWithFetch';

export type ProcessStatusCounts = {
    process_counts: Record<ProcessStatus, number>;
    task_counts: Record<ProcessStatus, number>;
};

export const useProcessStatusCountsQuery = () => {
    const { processStatusCountsEndpoint } = useContext(
        OrchestratorConfigContext,
    );
    return useQueryWithFetch<ProcessStatusCounts, Record<string, never>>(
        processStatusCountsEndpoint,
        {},
        'processStatusCounts',
    );
};
