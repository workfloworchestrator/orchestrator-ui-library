import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    Process,
    ProcessListResult,
} from '@/types';
import { CACHETAG_TYPE_LIST, CacheTagType } from '@/types';
import { getCacheTag } from '@/utils/cacheTag';

export const processListSummaryQuery = `
    query ProcessListSummary(
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
                processId
                workflowName
                startedAt
            }
            pageInfo {
                totalItems
                startCursor
                endCursor
            }
        }
    }
`;

export type ProcessSummary = Pick<
    Process,
    'processId' | 'workflowName' | 'startedAt'
>;

export type ProcessListSummaryResponse = {
    processes: ProcessSummary[];
} & BaseGraphQlResult;

const processApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getProcessListSummary: build.query<
            ProcessListSummaryResponse,
            GraphqlQueryVariables<Process>
        >({
            query: (variables) => ({
                document: processListSummaryQuery,
                variables,
            }),
            transformResponse: (
                response: ProcessListResult<ProcessSummary>,
            ): ProcessListSummaryResponse => {
                const processes = response.processes.page || [];

                return {
                    processes,
                    pageInfo: response.processes?.pageInfo || {},
                };
            },
            providesTags: getCacheTag(
                CacheTagType.processes,
                CACHETAG_TYPE_LIST,
            ),
        }),
    }),
});

export const { useGetProcessListSummaryQuery } = processApi;
