import { PROCESS_STATUS_COUNTS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, CacheTags, orchestratorApi } from '@/rtk';
import { ProcessStatus } from '@/types';

export type ProcessStatusCounts = {
    process_counts: Record<ProcessStatus, number>;
    task_counts: Record<ProcessStatus, number>;
};

const processStatusApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        processStatusCounts: build.query<ProcessStatusCounts, void>({
            query: () => ({
                url: `${PROCESS_STATUS_COUNTS_ENDPOINT}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
            providesTags: [CacheTags.processStatusCounts],
        }),
    }),
});

export const { useProcessStatusCountsQuery } = processStatusApi;
