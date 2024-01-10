import {
    GraphQLPageInfo,
    GraphqlQueryVariables,
    Process,
    ProcessListResult,
} from '@/types';

import { orchestratorApi } from '../api';

const workflowQuery = `
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

type ProcessListResponse = {
    processes: Process[];
    totalItems: GraphQLPageInfo['totalItems'];
    sortFields: GraphQLPageInfo['sortFields'] | undefined;
    filterFields: GraphQLPageInfo['filterFields'] | undefined;
};

const workflowsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getWorkflows: build.query<
            ProcessListResponse,
            GraphqlQueryVariables<Process>
        >({
            query: (variables) => ({ document: workflowQuery, variables }),
            transformResponse: (
                response: ProcessListResult,
            ): ProcessListResponse => {
                const processes = response?.processes?.page || [];
                const { totalItems, sortFields, filterFields } =
                    response.processes?.pageInfo || {};
                return {
                    processes,
                    totalItems,
                    sortFields,
                    filterFields,
                };
            },
        }),
    }),
});

export const { useGetWorkflowsQuery } = workflowsApi;
