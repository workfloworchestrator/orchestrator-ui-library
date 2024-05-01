import { PROCESSES_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import {
    ProcessDetail,
    ProcessDetailResultRaw,
    ProcessesDetailResult,
} from '@/types';

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
                    executed
                    stateDelta
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
    }),
});

export const { useGetProcessDetailQuery, useGetRawProcessDetailQuery } =
    processDetailApi;
