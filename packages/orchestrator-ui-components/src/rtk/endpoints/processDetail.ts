import {
  PROCESSES_ENDPOINT,
  PROCESSES_RESUME_ALL_ENDPOINT,
  PROCESS_ABORT_ENDPOINT,
  PROCESS_RESUME_ENDPOINT,
} from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
  CacheTagType,
  ProcessDetail,
  ProcessDetailResultRaw,
  ProcessPatchParams,
  ProcessesDetailResult,
  StepImportance,
} from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

export const processDetailQuery = `query ProcessDetail($processId: String!) {
        processes(filterBy: { value: $processId, field: "processId" }) {
            page {
                processId
                lastStatus
                createdBy
                startedAt
                lastModifiedAt
                lastStep
                workflowName
                isTask
                form
                traceback
                note
                userPermissions {
                    retryAllowed
                    resumeAllowed
                }
                steps {
                    name
                    status
                    stepId
                    stateDelta
                    started
                    completed
                    createdBy
                    # TEMP-STUB: re-add importance once the backend exposes it
                }
                customer {
                    fullname
                }
                subscriptions {
                    page {
                        product {
                            name
                        }
                        description
                        subscriptionId
                    }
                }
            }
        }
    }`;

export type ProcessDetailResponse = {
  processes: ProcessDetail[];
};

const processDetailApi = orchestratorApi.injectEndpoints({
  endpoints: (builder) => ({
    getProcessDetail: builder.query<ProcessDetailResponse, { processId: string }>({
      query: (variables) => ({
        document: processDetailQuery,
        variables,
      }),
      transformResponse: (response: ProcessesDetailResult): ProcessDetailResponse => {
        // TEMP-STUB: assign a fake importance per step to test the step presentations. Remove before merging.
        const stubImportances = [StepImportance.LOW, StepImportance.DEFAULT, StepImportance.LOW, StepImportance.HIGH];
        const processes = (response.processes.page || []).map((process) => ({
          ...process,
          steps: process.steps.map((step, index) => ({
            ...step,
            importance: step.importance ?? stubImportances[index % stubImportances.length],
          })),
        }));

        return {
          processes,
        };
      },
      providesTags: (result, error, queryArguments) => {
        if (!error && result) {
          return getCacheTag(CacheTagType.processes, queryArguments.processId);
        }
        return [];
      },
    }),
    getRawProcessDetail: builder.query<ProcessDetailResultRaw, { processId: string }>({
      query: ({ processId }) => ({
        url: `${PROCESSES_ENDPOINT}/${processId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
    retryAllProcesses: builder.mutation<void, null>({
      query: () => ({
        url: `${PROCESSES_ENDPOINT}/${PROCESSES_RESUME_ALL_ENDPOINT}`,
        method: 'PUT',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.processes),
    }),
    retryProcess: builder.mutation<void, { processId: string }>({
      query: ({ processId }) => ({
        url: `${PROCESSES_ENDPOINT}/${processId}/${PROCESS_RESUME_ENDPOINT}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{}',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.processes),
    }),
    deleteProcess: builder.mutation<void, { processId: string }>({
      query: ({ processId }) => ({
        url: `${PROCESSES_ENDPOINT}/${processId}`,
        method: 'DELETE',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.processes),
    }),
    abortProcess: builder.mutation<void, { processId: string }>({
      query: ({ processId }) => ({
        url: `${PROCESSES_ENDPOINT}/${processId}/${PROCESS_ABORT_ENDPOINT}`,
        method: 'PUT',
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: getCacheTag(CacheTagType.processes),
    }),
    patchProcess: builder.mutation<void, ProcessPatchParams>({
      query: (process) => ({
        url: `${PROCESSES_ENDPOINT}/${process.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          note: process.note,
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
      invalidatesTags: [CacheTagType.processes, CacheTagType.subscriptions],
    }),
  }),
});

export const {
  useGetProcessDetailQuery,
  useGetRawProcessDetailQuery,
  useRetryAllProcessesMutation,
  useRetryProcessMutation,
  useDeleteProcessMutation,
  useAbortProcessMutation,
  usePatchProcessMutation,
} = processDetailApi;
