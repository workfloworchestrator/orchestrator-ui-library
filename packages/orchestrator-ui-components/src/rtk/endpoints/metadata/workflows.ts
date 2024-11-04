import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    WorkflowDefinition,
    WorkflowDefinitionsResult,
} from '@/types';

export const workflowsDescription = `
query MetadataWorkflowsDescription(
    $workflowName: String!
) {
    workflows(
        filterBy: [{ field: "name", value: $workflowName }]
    ) {
        page {
            name
            description
        }
    }
}
`;

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

export type WorkflowsDescriptionResponse = Pick<
    WorkflowDefinition,
    'name' | 'description'
>;

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
        getDescriptionForWorkflowName: builder.query<
            WorkflowsDescriptionResponse,
            { workflowName: string }
        >({
            query: (variables) => ({
                document: workflowsDescription,
                variables,
            }),
            transformResponse: (
                response: WorkflowDefinitionsResult<
                    Pick<WorkflowDefinition, 'name' | 'description'>
                >,
                _,
                variables,
            ): WorkflowsDescriptionResponse => {
                const workflows = response.workflows.page || [];
                const workflow = workflows.find(
                    (value) => value.name === variables.workflowName,
                );

                if (!workflow) {
                    return {
                        name: variables.workflowName,
                    };
                }

                const { name, description } = workflow;
                return {
                    name,
                    description,
                };
            },
        }),
    }),
});

export const {
    useGetWorkflowsQuery,
    useLazyGetWorkflowsQuery,
    useGetDescriptionForWorkflowNameQuery,
} = workflowsApi;
