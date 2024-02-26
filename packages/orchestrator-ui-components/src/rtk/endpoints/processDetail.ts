import { orchestratorApi } from '@/rtk';
import { ProcessDetail, ProcessesDetailResult } from '@/types';

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
    }),
});

export const { useGetProcessDetailQuery } = processDetailApi;
