import { orchestratorApi } from '@/rtk';
import {
    BaseGraphQlResult,
    GraphqlQueryVariables,
    ScheduledTaskDefinition,
    ScheduledTasksDefinitionsResult,
} from '@/types';

export const scheduledTasks = `
    query ScheduledTasks(
        $first: Int!
        $after: Int!
        $sortBy: [GraphqlSort!]
    ) {
        scheduledTasks(first: $first, after: $after, sortBy: $sortBy) {
            page {
                id
                name
                nextRunTime
                trigger
                workflowId
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

export type ScheduledTasksResponse = {
    schedules: ScheduledTaskDefinition[];
} & BaseGraphQlResult;

const scheduledTasksApi = orchestratorApi.injectEndpoints({
    endpoints: (builder) => ({
        getScheduledTasks: builder.query<
            ScheduledTasksResponse,
            GraphqlQueryVariables<ScheduledTaskDefinition>
        >({
            query: (variables) => ({
                document: scheduledTasks,
                variables,
            }),
            transformResponse: (
                response: ScheduledTasksDefinitionsResult,
            ): ScheduledTasksResponse => {
                const schedules = response.scheduledTasks.page || [];
                const pageInfo = response.scheduledTasks.pageInfo || {};

                return {
                    schedules,
                    pageInfo,
                };
            },
        }),
    }),
});

export const { useGetScheduledTasksQuery, useLazyGetScheduledTasksQuery } =
    scheduledTasksApi;
