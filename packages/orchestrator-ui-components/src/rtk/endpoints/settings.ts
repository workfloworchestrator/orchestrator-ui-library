import {
  SETTINGS_CACHE_ENDPOINT,
  SETTINGS_CACHE_NAMES_ENDPOINT,
  SETTINGS_ENGINE_STATUS_ENDPOINT,
  SETTINGS_OVERVIEW,
  SETTINGS_SEARCH_INDEX_RESET_ENDPOINT,
  SETTINGS_WORKER_STATUS_ENDPOINT,
} from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { CacheNames, CacheTagType, EngineStatus, EnvironmentVariables, WorkerTypes } from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

interface EngineStatusReturnValue {
  engineStatus: EngineStatus;
  runningProcesses: number;
}

interface WorkerStatusReturnValue {
  executorType: WorkerTypes;
  numberOfWorkersOnline: number;
  numberOfQueuedJobs: number;
  numberOfRunningJobs: number;
}

interface WorkerStatusData {
  executor_type: string;
  number_of_workers_online: number;
  number_of_queued_jobs: number;
  number_of_running_jobs: number;
}
const statusApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    getEngineStatus: build.query<EngineStatusReturnValue, void>({
      query: () => SETTINGS_ENGINE_STATUS_ENDPOINT,
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      transformResponse(data: { global_status: string; running_processes: number }) {
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
    getWorkerStatus: build.query<WorkerStatusReturnValue, void>({
      query: () => SETTINGS_WORKER_STATUS_ENDPOINT,
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      transformResponse: (data: WorkerStatusData) => {
        return {
          executorType: data?.executor_type as WorkerTypes,
          numberOfWorkersOnline: data?.number_of_workers_online || 0,
          numberOfQueuedJobs: data?.number_of_queued_jobs || 0,
          numberOfRunningJobs: data?.number_of_running_jobs || 0,
        };
      },
      providesTags: getCacheTag(CacheTagType.workerStatus),
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
        url: SETTINGS_ENGINE_STATUS_ENDPOINT,
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
    getEnvironmentVariables: build.query<EnvironmentVariables[], void>({
      query: () => SETTINGS_OVERVIEW,
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const {
  useGetEngineStatusQuery,
  useGetCacheNamesQuery,
  useClearCacheMutation,
  useResetTextSearchIndexMutation,
  useSetEngineStatusMutation,
  useGetWorkerStatusQuery,
  useGetEnvironmentVariablesQuery,
} = statusApi;
