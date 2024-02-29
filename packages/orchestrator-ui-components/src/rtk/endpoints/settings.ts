import { EngineStatus } from '@/types';

import { BaseQueryTypes, CacheTags, orchestratorApi } from '../api';

interface EngineStatusReturnValue {
    engineStatus: EngineStatus;
    runningProcesses: number;
}

const statusApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getEngineStatus: build.query<EngineStatusReturnValue, void>({
            query: () => '/settings/status',
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
            transformResponse(data: {
                global_status: string;
                running_processes: number;
            }) {
                const engineStatus = (() => {
                    switch (data?.global_status) {
                        case 'RUNNING':
                            return EngineStatus.RUNNING;
                        case 'PAUSING':
                            return EngineStatus.PAUSING;
                        case 'PAUSED':
                            return EngineStatus.PAUSED;
                        default:
                            return EngineStatus.UNKNOWN;
                    }
                })();
                return {
                    engineStatus,
                    runningProcesses: data?.running_processes || 0,
                };
            },
            providesTags: [CacheTags.engineStatus],
        }),
        clearCache: build.mutation<void, string>({
            query: (settingName) => ({
                url: `/settings/cache/${settingName}`,
                method: 'DELETE',
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        resetTextSearchIndex: build.mutation<void, string>({
            query: () => ({
                url: `/settings/search-index/reset`,
                method: 'POST',
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        setEngineStatus: build.mutation<EngineStatusReturnValue, boolean>({
            query: (globalStatus) => ({
                url: `/settings/status`,
                method: 'PUT',
                body: JSON.stringify({
                    global_lock: globalStatus,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
            invalidatesTags: [CacheTags.engineStatus],
        }),
    }),
});

export const {
    useGetEngineStatusQuery,
    useClearCacheMutation,
    useResetTextSearchIndexMutation,
    useSetEngineStatusMutation,
} = statusApi;
