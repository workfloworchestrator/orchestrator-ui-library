import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    TaskDefinition,
    TaskDefinitionsResult,
} from '@/types';

export const tasksQuery = `
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
        filterBy: { field: "target", value: "SYSTEM" }
    ) {
        page {
            workflowId
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

export type TasksResponse = {
    tasks: TaskDefinition[];
} & BaseGraphQlResult;

const tasksApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<
            TasksResponse,
            GraphqlQueryVariables<TaskDefinition>
        >({
            query: (variables) => ({
                document: tasksQuery,
                variables,
            }),
            transformResponse: (
                response: TaskDefinitionsResult,
            ): TasksResponse => {
                const tasks = response.workflows.page || [];
                const pageInfo = response.workflows.pageInfo || {};

                return {
                    tasks,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetTasksQuery, useLazyGetTasksQuery } = tasksApi;
