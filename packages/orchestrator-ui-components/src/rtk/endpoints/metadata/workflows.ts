import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '@/types';

export const workflowsQuery = `
query MetadataWorkflows(
    $first: Int!
    $after: Int!
    $sortBy: [GraphqlSort!]
    $query: String
) {
    workflows(
        first: $first
        after: $after
        sortBy: $sortBy
        query: $query
        filterBy: { field: "target", value: "CREATE|MODIFY|TERMINATE" }
    ) {
        page {
            name
            description
            target
            products {
                tag
            }
            createdAt
        }
        pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
            totalItems
            sortFields
            filterFields
        }
    }
}
`;

export type WorkflowsResponse = {
    workflows: WorkflowDefinition[];
} & BaseGraphQlResult;

const workflowsApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getWorkflows: builder.query<
            WorkflowsResponse,
            GraphqlQueryVariables<WorkflowDefinition>
        >({
            query: (variables) => ({
                document: workflowsQuery,
                variables,
            }),
            transformResponse: (
                response: WorkflowDefinitionsResult,
            ): WorkflowsResponse => {
                const workflows = response.workflows.page || [];
                const pageInfo = response.workflows.pageInfo || {};

                return {
                    workflows,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetWorkflowsQuery, useLazyGetWorkflowsQuery } = workflowsApi;
