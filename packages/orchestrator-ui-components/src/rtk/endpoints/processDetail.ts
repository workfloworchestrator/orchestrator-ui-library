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
    ProcessesDetailResult,
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
                steps {
                    name
                    status
                    stepId
                    stateDelta
                    started
                    completed
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
        getProcessDetail: builder.query<
            ProcessDetailResponse,
            { processId: string }
        >({
            query: (variables) => ({
                document: processDetailQuery,
                variables,
            }),
            transformResponse: (
                response: ProcessesDetailResult,
            ): ProcessDetailResponse => {
                const processes = response.processes.page || [];

                return {
                    processes,
                };
            },
            providesTags: (result, error, queryArguments) => {
                if (!error && result) {
                    return getCacheTag(
                        CacheTagType.processes,
                        queryArguments.processId,
                    );
                }
                return [];
            },
        }),
        getRawProcessDetail: builder.query<
            ProcessDetailResultRaw,
            { processId: string }
        >({
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
    }),
});

export const {
    useGetProcessDetailQuery,
    useGetRawProcessDetailQuery,
    useRetryAllProcessesMutation,
    useRetryProcessMutation,
    useDeleteProcessMutation,
    useAbortProcessMutation,
} = processDetailApi;
