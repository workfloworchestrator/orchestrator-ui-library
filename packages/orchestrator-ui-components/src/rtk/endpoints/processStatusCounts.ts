import { PROCESS_STATUS_COUNTS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { CacheTagType, ProcessStatus } from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

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
            providesTags: getCacheTag(CacheTagType.processStatusCounts),
        }),
    }),
});

export const { useProcessStatusCountsQuery } = processStatusApi;
