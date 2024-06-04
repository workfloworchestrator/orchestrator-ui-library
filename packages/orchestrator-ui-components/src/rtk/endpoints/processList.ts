import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    Process,
    ProcessListResult,
} from '@/types';

import { CacheTags, orchestratorApi } from '../api';

export const processListQuery = `
    query ProcessList(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
        $filterBy: [GraphqlFilter!]
        $query: String
    ) {
        processes(
            first: $first
            after: $after
            sortBy: $sortBy
            filterBy: $filterBy
            query: $query
        ) {
            page {
                workflowName
                lastStep
                lastStatus
                workflowTarget
                product {
                    name
                    tag
                }
                customer {
                    fullname
                    shortcode
                }
                createdBy
                assignee
                processId
                startedAt
                lastModifiedAt
                isTask
                subscriptions {
                    page {
                        subscriptionId
                        description
                    }
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                totalItems
                endCursor
                sortFields
                filterFields
            }
        }
    }
`;

export type ProcessListResponse = {
    processes: Process[];
} & BaseGraphQlResult;

const processApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getProcessList: build.query<
            ProcessListResponse,
            GraphqlQueryVariables<Process>
        >({
            query: (variables) => ({ document: processListQuery, variables }),
            transformResponse: (
                response: ProcessListResult,
            ): ProcessListResponse => {
                const processes = response.processes.page || [];

                return {
                    processes,
                    pageInfo: response.processes?.pageInfo || {},
                };
            },
            providesTags: [CacheTags.processes],
        }),
    }),
});

export const { useGetProcessListQuery, useLazyGetProcessListQuery } =
    processApi;
