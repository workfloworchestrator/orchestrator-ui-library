import {
    SETTINGS_CACHE_ENDPOINT,
    SETTINGS_CACHE_NAMES_ENDPOINT,
    SETTINGS_SEARCH_INDEX_RESET_ENDPOINT,
    SETTINGS_STATUS_ENDPOINT,
} from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { CacheNames, CacheTagType, EngineStatus } from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

interface EngineStatusReturnValue {
    engineStatus: EngineStatus;
    runningProcesses: number;
}

const statusApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getEngineStatus: build.query<EngineStatusReturnValue, void>({
            query: () => SETTINGS_STATUS_ENDPOINT,
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
            providesTags: getCacheTag(CacheTagType.engineStatus),
        }),
        getCacheNames: build.query<CacheNames, void>({
            query: () => SETTINGS_CACHE_NAMES_ENDPOINT,
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        clearCache: build.mutation<void, string>({
            query: (settingName) => ({
                url: `${SETTINGS_CACHE_ENDPOINT}/${settingName}`,
                method: 'DELETE',
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        resetTextSearchIndex: build.mutation<void, null>({
            query: () => ({
                url: SETTINGS_SEARCH_INDEX_RESET_ENDPOINT,
                method: 'POST',
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        setEngineStatus: build.mutation<EngineStatusReturnValue, boolean>({
            query: (globalStatus) => ({
                url: SETTINGS_STATUS_ENDPOINT,
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
            invalidatesTags: getCacheTag(CacheTagType.engineStatus),
        }),
    }),
});

export const {
    useGetEngineStatusQuery,
    useGetCacheNamesQuery,
    useClearCacheMutation,
    useResetTextSearchIndexMutation,
    useSetEngineStatusMutation,
} = statusApi;
