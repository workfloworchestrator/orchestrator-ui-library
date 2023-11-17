import { useContext } from 'react';

import { useQueryWithFetch } from './useQueryWithFetch';
import { OrchestratorConfigContext } from '../contexts/OrchestratorConfigContext';
import { ProcessStatus } from '../types';

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
